#!/usr/bin/env python3
"""Extract a PRIVATE off-VM backup archive into a distinct disposable directory.

Only regular files and directories, no links or special files. Prevent absolute,
parent traversal, duplicate paths, excessive extracted sizes and disk exhaustion.
Never log file names or contents; caller keeps both archive and destination 0700.
"""
import os
import pathlib
import shutil
import sys
import tarfile

def extract(archive, output, limit_bytes):
    dest = pathlib.Path(output)
    if not dest.is_dir() or dest.is_symlink():
        raise ValueError("isolated output must exist and be a real directory")
    dest = dest.resolve(strict=True)
    with tarfile.open(archive, "r:gz") as source:
        members = source.getmembers()
        if not members or len(members) > 200_000:
            raise ValueError("archive entry count out of bounds")
        seen = set()
        total_bytes = 0
        checked = []
        for member in members:
            name = member.name
            if name.startswith("/") or "\0" in name:
                raise ValueError("unsafe archive path")
            parts = pathlib.PurePosixPath(name).parts
            if not parts and member.isdir():
                # GNU tar -czf backup.tar.gz . starts with a root "./" dir.
                continue
            if any(p == ".." for p in parts) or not parts:
                raise ValueError("unsafe archive traversal")
            if not member.isdir() and not member.isfile():
                raise ValueError("archive contains link, device or special file")
            relative = pathlib.Path(*parts)
            target = dest / relative
            if os.path.commonpath([str(dest), str(target.resolve(strict=False))]) != str(dest):
                raise ValueError("output path escaped private sandbox")
            key = str(relative).casefold()
            if key in seen and key != ".":
                raise ValueError("duplicate archive member")
            seen.add(key)
            if member.isfile():
                if member.size < 0:
                    raise ValueError("invalid member size")
                total_bytes += member.size
            checked.append((member, target))
        if total_bytes > limit_bytes:
            raise ValueError("uncompressed archive exceeds local QA budget")
        free = shutil.disk_usage(dest).free
        if total_bytes + 256 * 1024 * 1024 > free:
            raise ValueError("insufficient free disk for safe local extraction")
        for member, target in checked:
            if member.isdir():
                target.mkdir(parents=True, exist_ok=True, mode=0o700)
                target.chmod(0o700)
            else:
                target.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
                # No symlinks can have been inserted by earlier members.
                stream = source.extractfile(member)
                if stream is None:
                    raise ValueError("missing archive member contents")
                with stream, target.open("xb") as writer:
                    os.chmod(target, 0o600)
                    remaining = member.size
                    while remaining > 0:
                        buf = stream.read(min(1024 * 1024, remaining))
                        if not buf:
                            raise ValueError("truncated archive member")
                        writer.write(buf)
                        remaining -= len(buf)
    expected = dest / "world.json"
    if not expected.is_file() or expected.is_symlink():
        raise ValueError("restored game world.json missing")
    return total_bytes

if __name__ == "__main__":
    try:
        if len(sys.argv) != 4:
            raise ValueError("usage: qa-restore-extract.py private.tar.gz private-output max-bytes")
        cap = int(sys.argv[3])
        if not 1024 <= cap <= 256 * 1024**3:
            raise ValueError("invalid extraction budget")
        nbytes = extract(sys.argv[1], sys.argv[2], cap)
        print("PASS: private archive extracted safely; uncompressed_bytes=" + str(nbytes))
    except Exception:
        # No raw exceptions: private member names might contain player information.
        print("QA_RESTORE_EXTRACT_FAIL: unsafe archive or insufficient isolated storage", file=sys.stderr)
        sys.exit(1)
