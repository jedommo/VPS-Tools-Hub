
#!/usr/bin/env bash

set -Eeuo pipefail

echo "================================="
echo "   MAMDOUH OS - SERVER CLEANUP"
echo "================================="

echo
echo "Disk usage BEFORE cleanup:"
df -h /

echo
echo "APT cache size:"
du -sh /var/cache/apt/archives 2>/dev/null || true

echo
echo "Docker disk usage:"
if command -v docker >/dev/null 2>&1; then
    docker system df || true
else
    echo "Docker is not installed."
fi

echo
echo "================================="
echo "WARNING"
echo "================================="
echo "This will:"
echo "1) Clean APT cache"
echo "2) Remove unused APT packages"
echo "3) Clean old temporary files"
echo
echo "Docker data will NOT be deleted."
echo

read -r -p "Continue? Type YES to confirm: " CONFIRM

if [[ "$CONFIRM" != "YES" ]]; then
    echo
    echo "Cleanup cancelled."
    exit 0
fi

echo
echo "[1/3] Cleaning APT cache..."
apt-get clean

echo "[2/3] Removing unused packages..."
apt-get autoremove -y

echo "[3/3] Cleaning temporary files..."
find /tmp -mindepth 1 -mtime +7 -delete 2>/dev/null || true

echo
echo "================================="
echo "CLEANUP COMPLETED"
echo "================================="

echo
echo "Disk usage AFTER cleanup:"
df -h /

echo
echo "Done!"
