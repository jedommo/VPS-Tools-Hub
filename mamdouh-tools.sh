#!/usr/bin/env bash

# ============================================================
# MAMDOUH SERVER TOOLKIT
# Maintenance & Management Tools
# ============================================================

TOOLKIT_VERSION="2.0.0"
REPO_URL="https://raw.githubusercontent.com/jedommo/VPS-Tools-Hub/main/mamdouh-tools.sh"

# Colors
CYAN='\033[1;36m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
RED='\033[1;31m'
BLUE='\033[1;34m'
RESET='\033[0m'

# ------------------------------------------------------------
# Startup animation
# ------------------------------------------------------------
loading_animation() {
    clear
    echo -e "${YELLOW}🚀 Loading MAMDOUH Server Toolkit v${TOOLKIT_VERSION}...${RESET}"
    echo

    for i in {1..25}; do
        echo -ne "${GREEN}▓${RESET}"
        sleep 0.02
    done

    echo -e " ${CYAN}Ready!${RESET}"
    sleep 0.4
}

if [ -z "${TOOLKIT_STARTED:-}" ]; then
    export TOOLKIT_STARTED=1
    loading_animation
fi

# ------------------------------------------------------------
# Basic functions
# ------------------------------------------------------------
pause() {
    echo
    read -r -p "Press Enter to return to the menu..."
}

require_root() {
    if [ "$(id -u)" -ne 0 ]; then
        echo
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

has_command() {
    command -v "$1" >/dev/null 2>&1
}

is_wsl() {
    grep -qiE "(microsoft|wsl)" /proc/version 2>/dev/null
}

section_header() {
    clear

    echo -e "${CYAN}╔══════════════════════════════════════════╗${RESET}"
    printf "${CYAN}║${RESET} %-40s ${CYAN}║${RESET}\n" "$1"
    echo -e "${CYAN}╚══════════════════════════════════════════╝${RESET}"
}

# ------------------------------------------------------------
# 1 - System Information
# ------------------------------------------------------------
system_info() {
    section_header "💻 SYSTEM INFORMATION"

    echo
    echo -e "🏷️  ${YELLOW}Hostname:${RESET} $(hostname)"
    echo -e "👤  ${YELLOW}Current User:${RESET} $(whoami)"

    if is_wsl; then
        echo -e "🪟  ${YELLOW}Environment:${RESET} WSL"
    else
        echo -e "🖥️  ${YELLOW}Environment:${RESET} Linux Server"
    fi

    echo
    echo -e "🐧  ${YELLOW}Operating System:${RESET}"

    if [ -f /etc/os-release ]; then
        . /etc/os-release
        echo "    ${PRETTY_NAME:-Unknown}"
    else
        echo "    Unknown"
    fi

    echo
    echo -e "🔧  ${YELLOW}Kernel:${RESET} $(uname -r)"
    echo -e "🏗️  ${YELLOW}Architecture:${RESET} $(uname -m)"
    echo -e "⏱️  ${YELLOW}Uptime:${RESET} $(uptime -p 2>/dev/null || uptime)"

    echo
    echo -e "⚡  ${YELLOW}CPU:${RESET}"

    if has_command lscpu; then
        lscpu | grep -E "Model name:|CPU\(s\):" | head -n 2 | sed 's/^/    /'
    else
        echo "    CPU Cores: $(nproc)"
    fi

    echo
    echo -e "🧠  ${YELLOW}Memory:${RESET}"
    free -h | sed 's/^/    /'

    echo
    echo -e "💾  ${YELLOW}Disk:${RESET}"
    df -h / | sed 's/^/    /'

    pause
}

# ------------------------------------------------------------
# 2 - Disk & Storage
# ------------------------------------------------------------
disk_check() {
    section_header "💾 DISK & STORAGE CHECK"

    echo
    echo -e "${YELLOW}--- Disk Usage ---${RESET}"
    df -h

    echo
    echo -e "${YELLOW}--- Inode Usage ---${RESET}"
    df -i

    echo
    echo -e "${YELLOW}--- Largest Directories in / ---${RESET}"
    du -xhd1 / 2>/dev/null | sort -h | tail -n 15

    pause
}

# ------------------------------------------------------------
# 3 - Performance
# ------------------------------------------------------------
performance_check() {
    section_header "⚡ PERFORMANCE CHECK"

    echo
    echo -e "${YELLOW}--- Uptime / Load ---${RESET}"
    uptime

    echo
    echo -e "${YELLOW}--- Memory ---${RESET}"
    free -h

    echo
    echo -e "${YELLOW}--- Top CPU Processes ---${RESET}"
    ps -eo pid,user,%cpu,%mem,comm --sort=-%cpu | head -n 11

    echo
    echo -e "${YELLOW}--- Top Memory Processes ---${RESET}"
    ps -eo pid,user,%mem,%cpu,comm --sort=-%mem | head -n 11

    pause
}

# ------------------------------------------------------------
# 4 - Running Services
# ------------------------------------------------------------
running_services() {
    section_header "🟢 RUNNING SERVICES"

    if has_command systemctl && ! is_wsl; then
        systemctl list-units --type=service --state=running
    elif has_command systemctl; then
        systemctl list-units --type=service --state=running 2>/dev/null || \
            echo -e "${YELLOW}systemctl is not fully available in this WSL environment.${RESET}"
    else
        echo -e "${RED}systemctl is not available on this system.${RESET}"
    fi

    pause
}

# ------------------------------------------------------------
# 5 - Failed Services
# ------------------------------------------------------------
failed_services() {
    section_header "❌ FAILED SERVICES"

    if has_command systemctl; then
        systemctl --failed 2>/dev/null || \
            echo -e "${YELLOW}No failed services found, or systemctl is unavailable.${RESET}"
    else
        echo -e "${RED}systemctl is not available on this system.${RESET}"
    fi

    pause
}

# ------------------------------------------------------------
# 6 - Update System
# ------------------------------------------------------------
update_system() {
    section_header "🔄 SYSTEM UPDATE"

    require_root || return

    echo
    echo "This will:"
    echo "1) Update package lists"
    echo "2) Upgrade installed packages"

    if ! confirm "Continue with system update?"; then
        echo -e "${YELLOW}Cancelled.${RESET}"
        pause
        return
    fi

    echo
    echo -e "${BLUE}[1/2] Updating package lists...${RESET}"
    apt-get update

    echo
    echo -e "${BLUE}[2/2] Upgrading packages...${RESET}"
    apt-get upgrade -y

    echo
    echo -e "${GREEN}✨ System update completed.${RESET}"

    pause
}

# ------------------------------------------------------------
# 7 - Repair APT
# ------------------------------------------------------------
repair_system() {
    section_header "🛠️ APT / PACKAGE REPAIR"

    require_root || return

    echo
    echo "This will try to:"
    echo "1) Configure unfinished packages"
    echo "2) Fix broken dependencies"
    echo "3) Update package lists"

    if ! confirm "Continue with repair?"; then
        echo -e "${YELLOW}Cancelled.${RESET}"
        pause
        return
    fi

    echo
    echo -e "${BLUE}[1/3] Configuring packages...${RESET}"
    dpkg --configure -a

    echo
    echo -e "${BLUE}[2/3] Fixing broken dependencies...${RESET}"
    apt-get install -f -y

    echo
    echo -e "${BLUE}[3/3] Updating package lists...${RESET}"
    apt-get update

    echo
    echo -e "${GREEN}✨ Repair process completed.${RESET}"

    pause
}

# ------------------------------------------------------------
# 8 - Safe Cleanup
# ------------------------------------------------------------
safe_cleanup() {
    section_header "🧹 SAFE SYSTEM CLEANUP"

    require_root || return

    echo
    echo "This will:"
    echo "1) Clean APT cache"
    echo "2) Remove unused packages"
    echo "3) Remove temporary files older than 7 days"
    echo
    echo -e "${YELLOW}Docker data will NOT be touched.${RESET}"

    if ! confirm "Continue with cleanup?"; then
        echo -e "${YELLOW}Cancelled.${RESET}"
        pause
        return
    fi

    echo
    echo -e "${BLUE}[1/3] Cleaning APT cache...${RESET}"
    apt-get clean

    echo -e "${BLUE}[2/3] Removing unused packages...${RESET}"
    apt-get autoremove -y

    echo -e "${BLUE}[3/3] Cleaning old temporary files...${RESET}"
    find /tmp -xdev -mindepth 1 -mtime +7 -delete 2>/dev/null || true

    echo
    echo -e "${GREEN}✨ Cleanup completed.${RESET}"

    echo
    df -h /

    pause
}

# ------------------------------------------------------------
# 9 - Users Information
# ------------------------------------------------------------
users_info() {
    section_header "👥 USERS INFORMATION"

    echo
    echo -e "👤  ${YELLOW}Current user:${RESET} $(whoami)"

    echo
    echo -e "📋  ${YELLOW}--- Local Users (UID >= 1000) ---${RESET}"

    local_users=$(awk -F: '$3 >= 1000 && $3 < 65534 {print $1 " (UID: " $3 ")"}' /etc/passwd)

    if [ -n "$local_users" ]; then
        echo "$local_users" | sed 's/^/    /'
    else
        echo "    No regular local users found."
    fi

    echo
    echo -e "🛡️  ${YELLOW}--- Users with sudo access ---${RESET}"

    if has_command getent; then
        sudo_users=$(getent group sudo 2>/dev/null | cut -d: -f4)

        if [ -n "$sudo_users" ]; then
            echo "$sudo_users" | tr ',' '\n' | sed 's/^/    /'
        else
            echo "    No users listed in the sudo group."
        fi
    fi

    echo
    echo -e "🟢  ${YELLOW}--- Currently logged in ---${RESET}"
    who 2>/dev/null | sed 's/^/    /' || true

    echo
    echo -e "📜  ${YELLOW}--- Recent logins ---${RESET}"
    last -n 10 2>/dev/null | sed 's/^/    /' || true

    pause
}

# ------------------------------------------------------------
# 10 - Network Information
# ------------------------------------------------------------
network_info() {
    section_header "🌐 NETWORK INFORMATION"

    echo
    echo -e "${YELLOW}--- Network Interfaces ---${RESET}"
    ip -brief address 2>/dev/null | sed 's/^/    /' || true

    echo
    echo -e "${YELLOW}--- Default Route ---${RESET}"
    ip route 2>/dev/null | grep default | sed 's/^/    /' || true

    echo
    echo -e "${YELLOW}--- DNS ---${RESET}"

    if [ -f /etc/resolv.conf ]; then
        grep -E "^nameserver" /etc/resolv.conf | sed 's/^/    /' || true
    fi

    echo
    echo -e "${YELLOW}--- Listening Ports ---${RESET}"
    ss -tulpn 2>/dev/null | sed 's/^/    /' || true

    pause
}

# ------------------------------------------------------------
# 11 - Docker Information
# ------------------------------------------------------------
docker_info() {
    section_header "🐳 DOCKER INFORMATION"

    if ! has_command docker; then
        echo
        echo -e "${RED}Docker is not installed.${RESET}"
        pause
        return
    fi

    echo
    echo -e "${YELLOW}--- Docker Version ---${RESET}"
    docker --version

    echo
    echo -e "${YELLOW}--- Containers ---${RESET}"
    docker ps -a

    echo
    echo -e "${YELLOW}--- Docker Disk Usage ---${RESET}"
    docker system df

    echo
    echo -e "${YELLOW}--- Container Resource Usage ---${RESET}"
    docker stats --no-stream 2>/dev/null || true

    pause
}

# ------------------------------------------------------------
# 12 - Restart Service
# ------------------------------------------------------------
restart_service() {
    section_header "🔄 RESTART SERVICE"

    require_root || return

    if ! has_command systemctl; then
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

    if ! systemctl list-unit-files "${service}.service" 2>/dev/null | grep -q "${service}.service"; then
        echo
        echo -e "${YELLOW}Warning: Service may not exist. Trying anyway...${RESET}"
    fi

    echo
    echo -e "${YELLOW}Current status:${RESET}"
    systemctl status "$service" --no-pager 2>/dev/null || true

    if ! confirm "Restart $service?"; then
        echo -e "${YELLOW}Cancelled.${RESET}"
        pause
        return
    fi

    systemctl restart "$service"

    echo
    echo -e "${GREEN}New status:${RESET}"
    systemctl status "$service" --no-pager 2>/dev/null || true

    pause
}

# ------------------------------------------------------------
# 13 - Update Toolkit
# ------------------------------------------------------------
update_toolkit() {
    section_header "🔄 UPDATE TOOLKIT"

    SCRIPT_PATH="$(readlink -f "$0" 2>/dev/null || echo "$0")"

    if [ ! -f "$SCRIPT_PATH" ]; then
        echo
        echo -e "${RED}❌ Cannot find the current toolkit file.${RESET}"
        echo -e "${YELLOW}Please run the toolkit from a downloaded .sh file.${RESET}"
        pause
        return
    fi

    TEMP_FILE="${SCRIPT_PATH}.new"

    echo
    echo -e "${YELLOW}Current version:${RESET} ${TOOLKIT_VERSION}"
    echo -e "${BLUE}Checking GitHub for the latest version...${RESET}"

    if has_command curl; then
        if ! curl -fsSL "$REPO_URL" -o "$TEMP_FILE"; then
            echo
            echo -e "${RED}❌ Failed to download the latest version.${RESET}"
            rm -f "$TEMP_FILE"
            pause
            return
        fi
    elif has_command wget; then
        if ! wget -qO "$TEMP_FILE" "$REPO_URL"; then
            echo
            echo -e "${RED}❌ Failed to download the latest version.${RESET}"
            rm -f "$TEMP_FILE"
            pause
            return
        fi
    else
        echo
        echo -e "${RED}❌ Neither curl nor wget is installed.${RESET}"
        pause
        return
    fi

    if [ ! -s "$TEMP_FILE" ]; then
        echo
        echo -e "${RED}❌ Downloaded file is empty.${RESET}"
        rm -f "$TEMP_FILE"
        pause
        return
    fi

    if ! head -n 1 "$TEMP_FILE" | grep -q "#!/usr/bin/env bash"; then
        echo
        echo -e "${RED}❌ Downloaded file does not appear to be a valid toolkit script.${RESET}"
        rm -f "$TEMP_FILE"
        pause
        return
    fi

    if cmp -s "$SCRIPT_PATH" "$TEMP_FILE"; then
        echo
        echo -e "${GREEN}✅ You already have the latest version!${RESET}"
        rm -f "$TEMP_FILE"
        pause
        return
    fi

    NEW_VERSION=$(grep -m1 '^TOOLKIT_VERSION=' "$TEMP_FILE" | cut -d'"' -f2)

    echo
    echo -e "${GREEN}✨ New version found!${RESET}"

    if [ -n "$NEW_VERSION" ]; then
        echo -e "${YELLOW}Latest version:${RESET} ${NEW_VERSION}"
    fi

    if ! confirm "Download and install the latest version?"; then
        echo -e "${YELLOW}Cancelled.${RESET}"
        rm -f "$TEMP_FILE"
        pause
        return
    fi

    chmod +x "$TEMP_FILE"

    if ! mv "$TEMP_FILE" "$SCRIPT_PATH"; then
        echo
        echo -e "${RED}❌ Failed to install the update.${RESET}"
        rm -f "$TEMP_FILE"
        pause
        return
    fi

    chmod +x "$SCRIPT_PATH"

    echo
    echo -e "${GREEN}✅ Toolkit updated successfully!${RESET}"
    echo -e "${YELLOW}🚀 Restarting toolkit...${RESET}"

    sleep 2

    export TOOLKIT_STARTED=1
    exec bash "$SCRIPT_PATH"
}

# ------------------------------------------------------------
# 14 - System Health Report
# ------------------------------------------------------------
system_health_report() {
    section_header "❤️ SYSTEM HEALTH REPORT"

    echo

    echo -e "${YELLOW}--- CPU Load ---${RESET}"
    uptime

    echo
    echo -e "${YELLOW}--- Memory ---${RESET}"
    free -h

    echo
    echo -e "${YELLOW}--- Disk ---${RESET}"
    df -h /

    echo
    echo -e "${YELLOW}--- Failed Services ---${RESET}"

    if has_command systemctl; then
        failed=$(systemctl --failed --no-legend 2>/dev/null | wc -l)

        if [ "$failed" -eq 0 ]; then
            echo -e "    ${GREEN}✅ No failed services.${RESET}"
        else
            echo -e "    ${RED}❌ Failed services found: $failed${RESET}"
        fi
    else
        echo "    systemctl unavailable."
    fi

    echo
    echo -e "${YELLOW}--- Disk Usage Status ---${RESET}"

    disk_percent=$(df -P / | awk 'NR==2 {gsub("%","",$5); print $5}')

    if [ "${disk_percent:-0}" -ge 90 ]; then
        echo -e "    ${RED}❌ Disk usage: ${disk_percent}% - CRITICAL${RESET}"
    elif [ "${disk_percent:-0}" -ge 80 ]; then
        echo -e "    ${YELLOW}⚠️  Disk usage: ${disk_percent}% - WARNING${RESET}"
    else
        echo -e "    ${GREEN}✅ Disk usage: ${disk_percent}% - OK${RESET}"
    fi

    echo
    echo -e "${YELLOW}--- Docker ---${RESET}"

    if has_command docker; then
        running_containers=$(docker ps -q 2>/dev/null | wc -l)
        total_containers=$(docker ps -aq 2>/dev/null | wc -l)

        echo "    Running containers: $running_containers"
        echo "    Total containers:   $total_containers"
    else
        echo "    Docker is not installed."
    fi

    echo
    echo -e "${GREEN}Health report completed.${RESET}"

    pause
}

# ------------------------------------------------------------
# 15 - Find Large Files
# ------------------------------------------------------------
find_large_files() {
    section_header "🔎 FIND LARGE FILES"

    echo
    read -r -p "Enter path to scan [default: /]: " scan_path

    scan_path="${scan_path:-/}"

    if [ ! -d "$scan_path" ]; then
        echo
        echo -e "${RED}❌ Directory does not exist: $scan_path${RESET}"
        pause
        return
    fi

    echo
    echo -e "${YELLOW}Searching for the 20 largest files in:${RESET} $scan_path"
    echo

    find "$scan_path" -xdev -type f -printf '%s %p\n' 2>/dev/null \
        | sort -nr \
        | head -n 20 \
        | while read -r size file; do
            printf "%10s  %s\n" "$(numfmt --to=iec --suffix=B "$size" 2>/dev/null || echo "$size bytes")" "$file"
        done

    pause
}

# ------------------------------------------------------------
# 16 - Check Open Ports
# ------------------------------------------------------------
check_open_ports() {
    section_header "🔓 CHECK OPEN / LISTENING PORTS"

    if has_command ss; then
        echo
        ss -tulpn
    elif has_command netstat; then
        echo
        netstat -tulpn
    else
        echo
        echo -e "${RED}❌ Neither ss nor netstat is available.${RESET}"
    fi

    pause
}

# ------------------------------------------------------------
# 17 - System Logs & Errors
# ------------------------------------------------------------
system_logs_errors() {
    section_header "📜 SYSTEM LOGS & ERRORS"

    if ! has_command journalctl; then
        echo
        echo -e "${RED}journalctl is not available.${RESET}"
        pause
        return
    fi

    echo
    echo -e "${YELLOW}Showing recent error-level system logs:${RESET}"
    echo

    journalctl -p 3 -n 50 --no-pager 2>/dev/null || \
        echo -e "${YELLOW}No error logs found or journal is unavailable.${RESET}"

    pause
}

# ------------------------------------------------------------
# 18 - Reboot Required Check
# ------------------------------------------------------------
reboot_required_check() {
    section_header "🔄 REBOOT REQUIRED CHECK"

    echo

    if [ -f /var/run/reboot-required ]; then
        echo -e "${YELLOW}⚠️  A system reboot is required.${RESET}"

        echo
        echo "Reason / packages:"

        if [ -f /var/run/reboot-required.pkgs ]; then
            cat /var/run/reboot-required.pkgs
        else
            echo "System packages were updated."
        fi
    else
        echo -e "${GREEN}✅ No reboot is currently required.${RESET}"
    fi

    pause
}

# ------------------------------------------------------------
# Main Menu
# ------------------------------------------------------------
main_menu() {
    while true; do
        clear

        echo -e "${CYAN}╔══════════════════════════════════════════╗${RESET}"
        echo -e "${CYAN}║${RESET}       🌟 ${GREEN}MAMDOUH SERVER TOOLKIT${RESET} 🌟        ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET}          ${YELLOW}Version: ${TOOLKIT_VERSION}${RESET}                  ${CYAN}║${RESET}"
        echo -e "${CYAN}╠══════════════════════════════════════════╣${RESET}"
        echo -e "${CYAN}║${RESET}                                          ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET} ${GREEN}[1]${RESET}  💻 System Information             ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET} ${GREEN}[2]${RESET}  💾 Disk & Storage Check           ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET} ${GREEN}[3]${RESET}  ⚡ Performance Check              ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET} ${GREEN}[4]${RESET}  🟢 Running Services               ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET} ${GREEN}[5]${RESET}  ❌ Failed Services                ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET} ${GREEN}[6]${RESET}  🔄 Update System                  ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET} ${GREEN}[7]${RESET}  🛠️  Fix APT / Broken Packages      ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET} ${GREEN}[8]${RESET}  🧹 Safe System Cleanup            ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET} ${GREEN}[9]${RESET}  👥 User Information               ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET} ${GREEN}[10]${RESET} 🌐 Network Information           ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET} ${GREEN}[11]${RESET} 🐳 Docker Information            ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET} ${GREEN}[12]${RESET} 🔄 Restart a Service             ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET} ${GREEN}[13]${RESET} ⬇️  Update Toolkit                ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET} ${GREEN}[14]${RESET} ❤️  System Health Report          ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET} ${GREEN}[15]${RESET} 🔎 Find Large Files               ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET} ${GREEN}[16]${RESET} 🔓 Check Open Ports               ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET} ${GREEN}[17]${RESET} 📜 System Logs & Errors           ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET} ${GREEN}[18]${RESET} 🔄 Reboot Required Check          ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET}                                          ${CYAN}║${RESET}"
        echo -e "${CYAN}║${RESET} ${RED}[0]${RESET}  🚪 Exit                           ${CYAN}║${RESET}"
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
            13) update_toolkit ;;
            14) system_health_report ;;
            15) find_large_files ;;
            16) check_open_ports ;;
            17) system_logs_errors ;;
            18) reboot_required_check ;;
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
