#!/usr/bin/env bash

echo "================================="
echo "   MAMDOUH OS - USERS INFO"
echo "================================="

echo
echo "Current user:"
whoami

echo
echo "================================="
echo "Users with UID >= 1000:"
echo "================================="
awk -F: '$3 >= 1000 && $3 < 65534 {print $1 " (UID: " $3 ")"}' /etc/passwd

echo
echo "================================="
echo "Users with sudo access:"
echo "================================="

if command -v getent >/dev/null 2>&1; then
    getent group sudo | cut -d: -f4 | tr ',' '\n' | sed '/^$/d'
fi

echo
echo "================================="
echo "Currently logged-in users:"
echo "================================="
who

echo
echo "================================="
echo "Recent login history:"
echo "================================="
last -n 10 2>/dev/null || echo "No login history available."

echo
echo "================================="
echo "Root account:"
echo "================================="
if id root >/dev/null 2>&1; then
    echo "Root user exists"
    echo "UID: $(id -u root)"
else
    echo "Root user not found"
fi

echo
echo "================================="
echo "Done!"
echo "================================="
