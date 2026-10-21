"""Synthetic-only archive security tests; no SSH, game VM, or real backup."""
import importlib.util
import io
import pathlib
import tarfile
import tempfile
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("qa_extract", ROOT / "tools" / "qa-restore-extract.py")
MOD = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MOD)


def archive(path, entries):
    with tarfile.open(path, "w:gz") as out:
        for name, typ, data in entries:
            entry = tarfile.TarInfo(name)
            if typ == "dir":
                entry.type = tarfile.DIRTYPE
                out.addfile(entry)
            elif typ == "link":
                entry.type = tarfile.SYMTYPE
                entry.linkname = "../outside"
                out.addfile(entry)
            else:
                entry.size = len(data)
                out.addfile(entry, io.BytesIO(data))


class PrivateRestoreSecurity(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix="dl-test-restore-")
        self.root = pathlib.Path(self.tmp.name)
        self.tar = self.root / "test.tar.gz"
        self.output = self.root / "private"
        self.output.mkdir()

    def tearDown(self):
        self.tmp.cleanup()

    def test_official_dot_prefix_and_files_restore(self):
        archive(self.tar, [
            ("./", "dir", b""),
            ("./world.json", "file", b'{"schema":"test-fixture"}'),
            ("./music/", "dir", b""),
            ("./music/safe.mp3", "file", b"synthetic-not-real-music"),
        ])
        count = MOD.extract(self.tar, self.output, 1_000_000)
        self.assertGreater(count, 20)
        self.assertEqual((self.output / "world.json").read_bytes(), b'{"schema":"test-fixture"}')
        self.assertEqual((self.output / "music" / "safe.mp3").read_bytes(),
                         b"synthetic-not-real-music")

    def test_path_traversal_rejected_before_extract(self):
        archive(self.tar, [
            ("world.json", "file", b"{}"),
            ("../escaped", "file", b"outside"),
        ])
        with self.assertRaises(ValueError):
            MOD.extract(self.tar, self.output, 1_000_000)
        self.assertFalse((self.root / "escaped").exists())
        self.assertFalse((self.output / "world.json").exists())

    def test_absolute_paths_rejected(self):
        archive(self.tar, [("/private/world.json", "file", b"{}")])
        with self.assertRaises(ValueError):
            MOD.extract(self.tar, self.output, 1_000_000)

    def test_links_rejected(self):
        archive(self.tar, [
            ("world.json", "file", b"{}"),
            ("world-link", "link", b""),
        ])
        with self.assertRaises(ValueError):
            MOD.extract(self.tar, self.output, 1_000_000)

    def test_duplicate_case_insensitive_path_rejected(self):
        archive(self.tar, [
            ("world.json", "file", b"{}"),
            ("WORLD.JSON", "file", b"{}"),
        ])
        with self.assertRaises(ValueError):
            MOD.extract(self.tar, self.output, 1_000_000)

    def test_uncompressed_size_limit_rejected(self):
        archive(self.tar, [("world.json", "file", b"x" * 2000)])
        with self.assertRaises(ValueError):
            MOD.extract(self.tar, self.output, 1024)

    def test_world_required(self):
        archive(self.tar, [("notes.txt", "file", b"nothing sensitive")])
        with self.assertRaises(ValueError):
            MOD.extract(self.tar, self.output, 1_000_000)


if __name__ == "__main__":
    unittest.main()
