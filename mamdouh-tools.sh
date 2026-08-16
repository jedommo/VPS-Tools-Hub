#!/usr/bin/env bash

# MAMDOUH Server Toolkit
# Run with: bash mamdouh-tools.sh

clear

pause() {
    echo
    read -r -p "Press Enter to return to the menu..."
}

require_root() {
    if [ "$(id -u)" -ne 0 ]; then
        echo "Please run this option as root or with sudo."
        pause
        return 1
    fi
    return 0
}

confirm() {
    local answer
    read -r -p "$1 [y/N]: " answer

    case "$answer" in
        y|Y|yes|YES|Yes)
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

system_info() {
    clear
    echo "=========================================="
    echo "        MAMDOUH SERVER TOOLKIT"
    echo "           SYSTEM INFORMATION"
    echo "=========================================="

    echo
    echo "Hostname: $(hostname)"
    echo "Current User: $(whoami)"

    echo
    echo "Operating System:"
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        echo "${PRETTY_NAME:-Unknown}"
    fi

    echo
    echo "Kernel:"
    uname -r

    echo
    echo "Architecture:"
    uname -m

    echo
    echo "Uptime:"
    uptime -p

    echo
    echo "CPU:"
    if command -v lscpu >/dev/null 2>&1; then
        lscpu | grep -E "Model name:|CPU\(s\):" | head -2
    else
        nproc
    fi

    echo
    echo "Memory:"
    free -h

    echo
    echo "Disk:"
    df -h /

    pause
}

disk_check() {
    clear
    echo "=========================================="
    echo "             DISK & STORAGE"
    echo "=========================================="

    echo
    echo "--- Disk Usage ---"
    df -h

    echo
    echo "--- Inode Usage ---"
    df -i

    echo
    echo "--- Largest Directories in / ---"
    du -xhd1 / 2>/dev/null | sort -h | tail -n 15

    pause
}

performance_check() {
    clear
    echo "=========================================="
    echo "           PERFORMANCE CHECK"
    echo "=========================================="

    echo
    echo "--- Uptime / Load ---"
    uptime

    echo
    echo "--- Memory ---"
    free -h

    echo
    echo "--- Top CPU Processes ---"
    ps -eo pid,user,%cpu,%mem,comm --sort=-%cpu | head -n 11

    echo
    echo "--- Top Memory Processes ---"
    ps -eo pid,user,%mem,%cpu,comm --sort=-%mem | head -n 11

    pause
}

running_services() {
    clear
    echo "=========================================="
    echo "            RUNNING SERVICES"
    echo "=========================================="

    if command -v systemctl >/dev/null 2>&1; then
        systemctl list-units --type=service --state=running
    else
        echo "systemctl is not available on this system."
    fi

    pause
}

failed_services() {
    clear
    echo "=========================================="
    echo "             FAILED SERVICES"
    echo "=========================================="

    if command -v systemctl >/dev/null 2>&1; then
        systemctl --failed
    else
        echo "systemctl is not available on this system."
    fi

    pause
}

update_system() {
    clear
    echo "=========================================="
    echo "             SYSTEM UPDATE"
    echo "=========================================="

    require_root || return

    echo
    echo "This will:"
    echo "1) Update package lists"
    echo "2) Upgrade installed packages"
    echo

    if ! confirm "Continue with system update?"; then
        echo "Cancelled."
        pause
        return
    fi

    echo
    echo "[1/2] Updating package lists..."
    apt-get update

    echo
    echo "[2/2] Upgrading packages..."
    apt-get upgrade -y

    echo
    echo "System update completed."

    pause
}

repair_system() {
    clear
    echo "=========================================="
    echo "         APT / PACKAGE REPAIR"
    echo "=========================================="

    require_root || return

    echo
    echo "This will try to:"
    echo "1) Configure unfinished packages"
    echo "2) Fix broken dependencies"
    echo "3) Update package lists"
    echo

    if ! confirm "Continue with repair?"; then
        echo "Cancelled."
        pause
        return
    fi

    echo
    echo "[1/3] Configuring packages..."
    dpkg --configure -a

    echo
    echo "[2/3] Fixing broken dependencies..."
    apt-get install -f -y

    echo
    echo "[3/3] Updating package lists..."
    apt-get update

    echo
    echo "Repair process completed."

    pause
}

safe_cleanup() {
    clear
    echo "=========================================="
    echo "             SAFE CLEANUP"
    echo "=========================================="

    require_root || return

    echo
    echo "This will:"
    echo "1) Clean APT cache"
    echo "2) Remove unused packages"
    echo "3) Remove temporary files older than 7 days"
    echo
    echo "Docker data will NOT be touched."
    echo

    if ! confirm "Continue with cleanup?"; then
        echo "Cancelled."
        pause
        return
    fi

    echo
    echo "[1/3] Cleaning APT cache..."
    apt-get clean

    echo "[2/3] Removing unused packages..."
    apt-get autoremove -y

    echo "[3/3] Cleaning old temporary files..."
    find /tmp -mindepth 1 -mtime +7 -delete 2>/dev/null || true

    echo
    echo "Cleanup completed."
    echo
    df -h /

    pause
}

users_info() {
    clear
    echo "=========================================="
    echo "             USERS INFORMATION"
    echo "=========================================="

    echo
    echo "Current user:"
    whoami

    echo
    echo "--- Local Users (UID >= 1000) ---"
    awk -F: '$3 >= 1000 && $3 < 65534 {print $1 " (UID: " $3 ")"}' /etc/passwd

    echo
    echo "--- Users with sudo access ---"
    if getent group sudo >/dev/null 2>&1; then
        sudo_users=$(getent group sudo | cut -d: -f4)
        if [ -n "$sudo_users" ]; then
            echo "$sudo_users" | tr ',' '\n'
        else
            echo "No users listed in the sudo group."
        fi
    fi

    echo
    echo "--- Currently logged in ---"
    who || true

    echo
    echo "--- Recent logins ---"
    last -n 10 2>/dev/null || true

    pause
}

network_info() {
    clear
    echo "=========================================="
    echo "          NETWORK INFORMATION"
    echo "=========================================="

    echo
    echo "--- Network Interfaces ---"
    ip -brief address 2>/dev/null || true

    echo
    echo "--- Default Route ---"
    ip route 2>/dev/null | grep default || true

    echo
    echo "--- DNS ---"
    if [ -f /etc/resolv.conf ]; then
        grep -E "^nameserver" /etc/resolv.conf || true
    fi

    echo
    echo "--- Listening Ports ---"
    ss -tulpn 2>/dev/null || true

    pause
}

docker_info() {
    clear
    echo "=========================================="
    echo "            DOCKER INFORMATION"
    echo "=========================================="

    if ! command -v docker >/dev/null 2>&1; then
        echo
        echo "Docker is not installed."
        pause
        return
    fi

    echo
    echo "--- Docker Version ---"
    docker --version

    echo
    echo "--- Containers ---"
    docker ps -a

    echo
    echo "--- Docker Disk Usage ---"
    docker system df

    echo
    echo "--- Container Resource Usage ---"
    docker stats --no-stream 2>/dev/null || true

    pause
}

restart_service() {
    clear
    echo "=========================================="
    echo "             RESTART SERVICE"
    echo "=========================================="

    require_root || return

    if ! command -v systemctl >/dev/null 2>&1; then
        echo "systemctl is not available."
        pause
        return
    fi

    echo
    read -r -p "Enter service name (example: nginx): " service

    if [ -z "$service" ]; then
        echo "No service entered."
        pause
        return
    fi

    echo
    echo "Current status:"
    systemctl status "$service" --no-pager 2>/dev/null || true

    echo
    if ! confirm "Restart $service?"; then
        echo "Cancelled."
        pause
        return
    fi

    systemctl restart "$service"

    echo
    echo "New status:"
    systemctl status "$service" --no-pager 2>/dev/null || true

    pause
}

main_menu() {
    while true; do
        clear

        echo "╔══════════════════════════════════════════╗"
        echo "║          MAMDOUH SERVER TOOLKIT          ║"
        echo "║       Maintenance & Management Tools     ║"
        echo "╠══════════════════════════════════════════╣"
        echo "║                                          ║"
        echo "║  [1]  System Information                 ║"
        echo "║  [2]  Disk & Storage Check               ║"
        echo "║  [3]  Memory & CPU Check                 ║"
        echo "║  [4]  Running Services                   ║"
        echo "║  [5]  Failed Services                    ║"
        echo "║  [6]  Update System                      ║"
        echo "║  [7]  Fix APT / Broken Packages          ║"
        echo "║  [8]  Safe System Cleanup                ║"
        echo "║  [9]  User Information                   ║"
        echo "║  [10] Network Information                ║"
        echo "║  [11] Docker Information                 ║"
        echo "║  [12] Restart a Service                  ║"
        echo "║                                          ║"
        echo "║  [0]  Exit                               ║"
        echo "║                                          ║"
        echo "╚══════════════════════════════════════════╝"

        echo
        read -r -p "Choose an option: " choice

        case "$choice" in
            1) system_info ;;
            2) disk_check ;;
            3) performance_check ;;
            4) running_services ;;
            5) failed_services ;;
            6) update_system ;;
            7) repair_system ;;
            8) safe_cleanup ;;
            9) users_info ;;
            10) network_info ;;
            11) docker_info ;;
            12) restart_service ;;
            0)
                echo
                echo "Goodbye from MAMDOUH Server Toolkit!"
                exit 0
                ;;
            *)
                echo
                echo "Invalid option."
                sleep 1
                ;;
        esac
    done
}

main_menu
