#!/usr/bin/env bash

echo "================================="
echo "   MAMDOUH OS - SYSTEM INFO"
echo "================================="

echo
echo "Hostname: $(hostname)"
echo "User: $(whoami)"
echo "OS:"
cat /etc/os-release | grep PRETTY_NAME

echo
echo "Kernel:"
uname -r

echo
echo "Uptime:"
uptime -p

echo
echo "Memory:"
free -h

echo
echo "Disk:"
df -h /

echo
echo "================================="
echo "Done!"
echo "================================="
