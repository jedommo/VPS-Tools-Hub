#!/usr/bin/env bash

# Define colors
CYAN='\033[1;36m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
RED='\033[1;31m'
BLUE='\033[1;34m'
RESET='\033[0m'

# Animated Loading Bar Function
loading_animation() {
    clear
    echo -e "${YELLOW}🚀 Loading MAMDOUH Server Toolkit... ${RESET}\n"
    for i in {1..25}; do
        echo -ne "${GREEN}▓${RESET}"
        sleep 0.02
    done
    echo -ne " ${CYAN}Ready!${RESET}\n\n"
    sleep 0.4
}

# Run the animation only on startup
if [ -z "$TOOLKIT_STARTED" ]; then
    export TOOLKIT_STARTED=1
    loading_animation
fi

clear

pause() {
    echo
    read -r -p "Press Enter to return to the menu..."
}

require_root() {
    if [ "$(id -u)" -ne 0 ]; then
        echo -e "${RED}❌ Please run this option as root or with sudo.${RESET}"
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
    echo -e "${CYAN}╔══════════════════════════════════════════╗${RESET}"
    echo -e "${CYAN}║${RESET}          💻  ${GREEN}SYSTEM INFORMATION${RESET}     💻          ${CYAN}║${RESET}"
    echo -e "${CYAN}╚══════════════════════════════════════════╝${RESET}"

    echo -e "\n🏷️  ${YELLOW}Hostname:${RESET} $(hostname)"
    echo -e "👤  ${YELLOW}Current User:${RESET} $(whoami)"

    echo -e "\n🐧  ${YELLOW}Operating System:${RESET}"
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        echo "    ${PRETTY_NAME:-Unknown}"
    fi

    echo -e "\n🔧  ${YELLOW}Kernel:${RESET} $(uname -r)"
    echo -e "🏗️  ${YELLOW}Architecture:${RESET} $(uname -m)"
    echo -e "⏱️  ${YELLOW}Uptime:${RESET} $(uptime -p)"

    echo -e "\n⚡  ${YELLOW}CPU:${RESET}"
    if command -v lscpu >/dev/null 2>&1; then
        lscpu | grep -E "Model name:|CPU\(s\):" | head -2 | sed 's/^/    /'
    else
        echo "    $(nproc)"
    fi

    echo -e "\n🧠  ${YELLOW}Memory:${RESET}"
    free -h | sed 's/^/    /'

    echo -e "\n💾  ${YELLOW}Disk:${RESET}"
    df -h / | sed 's/^/    /'

    pause
}

disk_check() {
    clear
    echo -e "${CYAN}╔══════════════════════════════════════════╗${RESET}"
    echo -e "${CYAN}║${RESET}          💾  ${GREEN}DISK & STORAGE${RESET}         💾          ${CYAN}║${RESET}"
    echo -e "${CYAN}╚══════════════════════════════════════════╝${RESET}"

    echo -e "\n📂  ${YELLOW}--- Disk Usage ---${RESET}"
    df -h

    echo -e "\n📊  ${YELLOW}--- Inode Usage ---${RESET}"
    df -i

    echo -e "\n📦  ${YELLOW}--- Largest Directories in / ---${RESET}"
    du -xhd1 / 2>/dev/null | sort -h | tail -n 15

    pause
}

performance_check() {
    clear
    echo -e "${CYAN}╔══════════════════════════════════════════╗${RESET}"
    echo -e "${CYAN}║${RESET}          ⚡  ${GREEN}PERFORMANCE CHECK${RESET}     ⚡          ${CYAN}║${RESET}"
    echo -e "${CYAN}╚══════════════════════════════════════════╝${RESET}"

    echo -e "\n⏱️  ${YELLOW}--- Uptime / Load ---${RESET}"
    uptime

    echo -e "\n🧠  ${YELLOW}--- Memory ---${RESET}"
    free -h

    echo -e "\n🔥  ${YELLOW}--- Top CPU Processes ---${RESET}"
    ps -eo pid,user,%cpu,%mem,comm --sort=-%cpu | head -n 11

    echo -e "\n💧  ${YELLOW}--- Top Memory Processes ---${RESET}"
    ps -eo pid,user,%mem,%cpu,comm --sort=-%mem | head -n 11

    pause
}

running_services() {
    clear
    echo -e "${CYAN}╔══════════════════════════════════════════╗${RESET}"
    echo -e "${CYAN}║${RESET}          🟢  ${GREEN}RUNNING SERVICES${RESET}      🟢          ${CYAN}║${RESET}"
    echo -e "${CYAN}╚══════════════════════════════════════════╝${RESET}\n"

    if command -v systemctl >/dev/null 2>&1; then
        systemctl list-units --type=service --state=running
    else
        echo -e "${RED}systemctl is not available on this system.${RESET}"
    fi

    pause
}

failed_services() {
    clear
    echo -e "${CYAN}╔══════════════════════════════════════════╗${RESET}"
    echo -e "${CYAN}║${RESET}          ❌  ${RED}FAILED SERVICES${RESET}       ❌          ${CYAN}║${RESET}"
    echo -e "${CYAN}╚══════════════════════════════════════════╝${RESET}\n"

    if command -v systemctl >/dev/null 2>&1; then
        systemctl --failed
    else
        echo -e "${RED}systemctl is not available on this system.${RESET}"
    fi

    pause
}

update_system() {
    clear
    echo -e "${CYAN}╔══════════════════════════════════════════╗${RESET}"
    echo -e "${CYAN}║${RESET}          🔄  ${GREEN}SYSTEM UPDATE${RESET}         🔄          ${CYAN}║${RESET}"
    echo -e "${CYAN}╚══════════════════════════════════════════╝${RESET}"

    require_root || return

    echo -e "\nThis will:"
    echo "1) Update package lists"
    echo "2) Upgrade installed packages"
    echo

    if ! confirm "Continue with system update?"; then
        echo -e "${YELLOW}Cancelled.${RESET}"
        pause
        return
    fi

    echo -e "\n${BLUE}[1/2] Updating package lists...${RESET}"
    apt-get update

    echo -e "\n${BLUE}[2/2] Upgrading packages...${RESET}"
    apt-get upgrade -y

    echo -e "\n${GREEN}✨ System update completed.${RESET}"

    pause
}

repair_system() {
    clear
    echo -e "${CYAN}╔══════════════════════════════════════════╗${RESET}"
    echo -e "${CYAN}║${RESET}          🛠️  ${GREEN}APT / PACKAGE REPAIR${RESET}  🛠️          ${CYAN}║${RESET}"
    echo -e "${CYAN}╚══════════════════════════════════════════╝${RESET}"

    require_root || return

    echo -e "\nThis will try to:"
    echo "1) Configure unfinished packages"
    echo "2) Fix broken dependencies"
    echo "3) Update package lists"
    echo

    if ! confirm "Continue with repair?"; then
        echo -e "${YELLOW}Cancelled.${RESET}"
        pause
        return
    fi

    echo -e "\n${BLUE}[1/3] Configuring packages...${RESET}"
    dpkg --configure -a

    echo -e "\n${BLUE}[2/3] Fixing broken dependencies...${RESET}"
    apt-get install -f -y

    echo -e "\n${BLUE}[3/3] Updating package lists...${RESET}"
    apt-get update

    echo -e "\n${GREEN}✨ Repair process completed.${RESET}"

    pause
}

safe_cleanup() {
    clear
    echo -e "${CYAN}╔══════════════════════════════════════════╗${RESET}"
    echo -e "${CYAN}║${RESET}          🧹  ${GREEN}SAFE SYSTEM CLEANUP${RESET}   🧹          ${CYAN}║${RESET}"
    echo -e "${CYAN}╚══════════════════════════════════════════╝${RESET}"

    require_root || return

    echo -e "\nThis will:"
    echo "1) Clean APT cache"
    echo "2) Remove unused packages"
    echo "3) Remove temporary files older than 7 days"
    echo -e "${YELLOW}Docker data will NOT be touched.${RESET}\n"

    if ! confirm "Continue with cleanup?"; then
        echo -e "${YELLOW}Cancelled.${RESET}"
        pause
        return
    fi

    echo -e "\n${BLUE}[1/3] Cleaning APT cache...${RESET}"
    apt-get clean

    echo -e "${BLUE}[2/3] Removing unused packages...${RESET}"
    apt-get autoremove -y

    echo -e "${BLUE}[3/3] Cleaning old temporary files...${RESET}"
    find /tmp -mindepth 1 -mtime +7 -delete 2>/dev/null || true

    echo -e "\n${GREEN}✨ Cleanup completed.${RESET}\n"
    df -h /

    pause
}

users_info() {
    clear
    echo -e "${CYAN}╔══════════════════════════════════════════╗${RESET}"
    echo -e "${CYAN}║${RESET}          👥  ${GREEN}USERS INFORMATION${RESET}     👥          ${CYAN}║${RESET}"
    echo -e "${CYAN}╚══════════════════════════════════════════╝${RESET}"

    echo -e "\n👤  ${YELLOW}Current user:${RESET} $(whoami)"

    echo -e "\n📋  ${YELLOW}--- Local Users (UID >= 1000) ---${RESET}"
    awk -F: '$3 >= 1000 && $3 < 65534 {print "    " $1 " (UID: " $3 ")"}' /etc/passwd

    echo -e "\n🛡️  ${YELLOW}--- Users with sudo access ---${RESET}"
    if getent group sudo >/dev/null 2>&1; then
        sudo_users=$(getent group sudo | cut -d: -f4)
        if [ -n "$sudo_users" ]; then
            echo "$sudo_users" | tr ',' '\n' | sed 's/^/    /'
        else
            echo "    No users listed in the sudo group."
        fi
    fi

    echo -e "\n🟢  ${YELLOW}--- Currently logged in ---${RESET}"
    who | sed 's/^/    /' || true

    echo -e "\n📜  ${YELLOW}--- Recent logins ---${RESET}"
    last -n 10 2>/dev/null | sed 's/^/    /' || true

    pause
}

network_info() {
    clear
    echo -e "${CYAN}╔══════════════════════════════════════════╗${RESET}"
    echo -e "${CYAN}║${RESET}          🌐  ${GREEN}NETWORK INFORMATION${RESET}   🌐          ${CYAN}║${RESET}"
    echo -e "${CYAN}╚══════════════════════════════════════════╝${RESET}"

    echo -e "\n🔌  ${YELLOW}--- Network Interfaces ---${RESET}"
    ip -brief address 2>/dev/null | sed 's/^/    /' || true

    echo -e "\n🛤️  ${YELLOW}--- Default Route ---${RESET}"
    ip route 2>/dev/null | grep default | sed 's/^/    /' || true

    echo -e "\n🔍  ${YELLOW}--- DNS ---${RESET}"
    if [ -f /etc/resolv.conf ]; then
        grep -E "^nameserver" /etc/resolv.conf | sed 's/^/    /' || true
    fi

    echo -e "\n📡  ${YELLOW}--- Listening Ports ---${RESET}"
    ss -tulpn 2>/dev/null | sed 's/^/    /' || true

    pause
}

docker_info() {
    clear
    echo -e "${CYAN}╔══════════════════════════════════════════╗${RESET}"
    echo -e "${CYAN}║${RESET}          🐳  ${GREEN}DOCKER INFORMATION${RESET}    🐳          ${CYAN}║${RESET}"
    echo -e "${CYAN}╚══════════════════════════════════════════╝${RESET}"

    if ! command -v docker >/dev/null 2>&1; then
        echo -e "\n${RED}Docker is not installed.${RESET}"
        pause
        return
    fi

    echo -e "\n🔖  ${YELLOW}--- Docker Version ---${RESET}"
    docker --version

    echo -e "\n📦  ${YELLOW}--- Containers ---${RESET}"
    docker ps -a

    echo -e "\n📊  ${YELLOW}--- Docker Disk Usage ---${RESET}"
    docker system df

    echo -e "\n📈  ${YELLOW}--- Container Resource Usage ---${RESET}"
    docker stats --no-stream 2>/dev/null || true

    pause
}

restart_service() {
    clear
    echo -e "${CYAN}╔══════════════════════════════════════════╗${RESET}"
    echo -e "${CYAN}║${RESET}          🔄  ${GREEN}RESTART SERVICE${RESET}       🔄          ${CYAN}║${RESET}"
    echo -e "${CYAN}╚══════════════════════════════════════════╝${RESET}"

    require_root || return

    if ! command -v systemctl >/dev/null 2>&1; then
        echo -e "${RED}systemctl is not available.${RESET}"
        pause
        return
    fi

    echo
    read -r -p "Enter service name (example: nginx): " service

    if [ -z "$service" ]; then
        echo -e "${RED}No service entered.${RESET}"
        pause
        return
    fi

    echo -e "\n${YELLOW}Current status:${RESET}"
    systemctl status "$service" --no-pager 2>/dev/null || true

    echo
    if ! confirm "Restart $service?"; then
        echo -e "${YELLOW}Cancelled.${RESET}"
        pause
        return
    fi

    systemctl restart "$service"

    echo -e "\n${GREEN}New status:${RESET}"
    systemctl status "$service" --no-pager 2>/dev/null || true

    pause
}

main_menu() {
    while true; do
        clear

        echo -e "${CYAN}╔══════════════════════════════════════════╗${RESET}"
        echo -e "${CYAN}║${RESET}          🌟  ${GREEN}MAMDOUH SERVER TOOLKIT${RESET}  🌟          ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET}       🛠️   Maintenance & Management   🛠️       ${CYAN}║${RESET}"
        echo -e "${CYAN}╠══════════════════════════════════════════╣${RESET}"
        echo -e "${CYAN}║${RESET}                                          ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET}  ${GREEN}[1]${RESET}  💻 System Information            ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET}  ${GREEN}[2]${RESET}  💾 Disk & Storage Check          ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET}  ${GREEN}[3]${RESET}  ⚡ Memory & CPU Check            ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET}  ${GREEN}[4]${RESET}  🟢 Running Services              ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET}  ${GREEN}[5]${RESET}  ❌ Failed Services               ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET}  ${GREEN}[6]${RESET}  🔄 Update System                 ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET}  ${GREEN}[7]${RESET}  🛠️ Fix APT / Broken Packages     ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET}  ${GREEN}[8]${RESET}  🧹 Safe System Cleanup           ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET}  ${GREEN}[9]${RESET}  👥 User Information              ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET}  ${GREEN}[10]${RESET} 🌐 Network Information          ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET}  ${GREEN}[11]${RESET} 🐳 Docker Information           ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET}  ${GREEN}[12]${RESET} 🔄 Restart a Service            ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET}                                          ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET}  ${RED}[0]${RESET}  🚪 Exit                          ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET}                                          ${CYAN}║${RESET}"
        echo -e "${CYAN}╚══════════════════════════════════════════╝${RESET}"

        echo
        read -r -p "👉 Choose an option: " choice

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
                echo -e "${GREEN}👋 Goodbye from MAMDOUH Server Toolkit!${RESET}"
                exit 0
                ;;
            *)
                echo
                echo -e "${RED}❌ Invalid option. Please try again.${RESET}"
                sleep 1
                ;;
        esac
    done
}

main_menu
