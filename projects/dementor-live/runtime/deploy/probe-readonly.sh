#!/usr/bin/env bash
# Dementor Live: information ONLY. No sudo, package install, mkdir, Docker writes or service changes.
set -u
printf '%s\n' '=== DEMENTOR LIVE REMOTE READ-ONLY PRECHECK ==='
date -Is 2>/dev/null || date
uname -a
printf '\n=== user / resources ===\n'
id
command -v free >/dev/null && free -h || true
command -v df >/dev/null && df -h / /srv /data 2>/dev/null || true
printf '\n=== deployment locations (stat only) ===\n'
for p in /srv /srv/dementor /srv/dementor-live /opt/dementor-live /data; do
  if [ -e "$p" ]; then
    stat -c '%A %U %G %n' "$p" 2>/dev/null || ls -ld "$p"
  else
    printf 'ABSENT %s\n' "$p"
  fi
done
printf '\n=== runtimes available ===\n'
for cmd in docker node npm nginx caddy ss; do
  if command -v "$cmd" >/dev/null 2>&1; then
    printf '%s: %s\n' "$cmd" "$(command -v "$cmd")"
  else
    printf '%s: not installed/in PATH\n' "$cmd"
  fi
done
if command -v docker >/dev/null 2>&1; then
  docker --version 2>&1 || true
  docker compose version 2>&1 || true
  printf '\n=== existing Compose projects (read-only) ===\n'
  docker compose ls 2>&1 || true
  printf '\n=== containers (read-only) ===\n'
  docker ps --format '{{.Names}} {{.Ports}} {{.Status}}' 2>&1 || true
  printf '\n=== Dementor-named volumes (read-only) ===\n'
  docker volume ls --format '{{.Name}}' 2>&1 | grep -E '^dementor-live[_-]' || true
fi
if command -v node >/dev/null 2>&1; then node -v; fi
printf '\n=== listeners (read-only) ===\n'
if command -v ss >/dev/null 2>&1; then ss -ltnp 2>&1 || true; fi
printf '\n=== firewall frontend (read-only) ===\n'
if command -v ufw >/dev/null 2>&1; then ufw status 2>&1 || true; fi
printf '\n=== result ===\n'
printf '%s\n' 'No game files, services, networks, ports, volumes, firewall or proxy were modified by this script.'
