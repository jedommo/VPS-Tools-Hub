#!/usr/bin/env bash

# ==========================================================
# MAMDOUH TERMINAL DASHBOARD
# ==========================================================

SESSION="mamdouh-dashboard"

# ---------- Colors ----------
RED='\033[1;31m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
CYAN='\033[1;36m'
MAGENTA='\033[1;35m'
RESET='\033[0m'

# ---------- Loading ----------
clear

echo
echo -e "${CYAN}"
echo "   ███╗   ███╗ █████╗ ███╗   ███╗██████╗  ██████╗ ██╗   ██╗██╗  ██╗"
echo "   ████╗ ████║██╔══██╗████╗ ████║██╔══██╗██╔═══██╗██║   ██║██║  ██║"
echo "   ██╔████╔██║███████║██╔████╔██║██║  ██║██║   ██║██║   ██║███████║"
echo "   ██║╚██╔╝██║██╔══██║██║╚██╔╝██║██║  ██║██║   ██║██║   ██║██╔══██║"
echo "   ██║ ╚═╝ ██║██║  ██║██║ ╚═╝ ██║██████╔╝╚██████╔╝╚██████╔╝██║  ██║"
echo "   ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚═════╝  ╚═════╝  ╚═════╝ ╚═╝  ╚═╝"
echo -e "${RESET}"

echo
echo -ne "${YELLOW}  Initializing Terminal Dashboard ${RESET}"

for i in {1..30}; do
    echo -ne "${GREEN}█${RESET}"
    sleep 0.03
done

echo
echo
echo -e "${CYAN}  ✓ Loading system modules${RESET}"
sleep 0.3
echo -e "${CYAN}  ✓ Checking terminal environment${RESET}"
sleep 0.3
echo -e "${CYAN}  ✓ Preparing dashboard${RESET}"
sleep 0.3
echo -e "${GREEN}  ✓ Ready!${RESET}"

sleep 1

# ---------- Check tmux ----------
if ! command -v tmux >/dev/null 2>&1; then
    echo
    echo -e "${YELLOW}tmux is not installed.${RESET}"

    if [ "$(id -u)" -eq 0 ]; then
        apt-get update && apt-get install -y tmux
    else
        sudo apt-get update && sudo apt-get install -y tmux
    fi
fi

# ---------- System Info ----------
SYSTEM_INFO='
while true; do
    clear

    echo "╔════════════════════════════════════════════╗"
    echo "║         MAMDOUH SYSTEM INFORMATION         ║"
    echo "╚════════════════════════════════════════════╝"

    echo
    echo " Hostname : $(hostname)"
    echo " User     : $(whoami)"

    if [ -f /etc/os-release ]; then
        . /etc/os-release
        echo " OS       : ${PRETTY_NAME}"
    fi

    echo " Kernel   : $(uname -r)"
    echo " Uptime   : $(uptime -p)"

    echo
    echo "---------------- MEMORY ----------------"

    free -h

    echo
    echo "---------------- DISK ------------------"

    df -h /

    echo
    echo "---------------- LOAD ------------------"

    uptime

    echo
    echo "Updating every 3 seconds..."

    sleep 3
done
'

# ---------- Animation ----------
ANIMATION='
frames=(
"   ✦"
"   ✧"
"   ★"
"   ✧"
"   ✦"
)

while true; do
    for frame in "${frames[@]}"; do
        clear

        echo
        echo "╔══════════════════════════════════╗"
        echo "║      MAMDOUH TERMINAL SYSTEM     ║"
        echo "╚══════════════════════════════════╝"

        echo
        echo
        echo "              $frame"
        echo
        echo "         SYSTEM ONLINE"
        echo
        echo "          ● ● ● ● ●"
        echo
        echo
        sleep 0.25
    done
done
'

# ---------- Kill old session ----------
tmux has-session -t "$SESSION" 2>/dev/null && \
tmux kill-session -t "$SESSION"

# ---------- Create tmux ----------
tmux new-session -d -s "$SESSION"

# Rename first window
tmux rename-window -t "$SESSION:0" "Dashboard"

# Pane 0 = Clean terminal
tmux send-keys -t "$SESSION:0.0" 'clear' C-m

# Split vertically
tmux split-window -h -t "$SESSION:0"

# Right pane = System Info
tmux send-keys -t "$SESSION:0.1" "$SYSTEM_INFO" C-m

# Split left pane horizontally
tmux split-window -v -t "$SESSION:0.0"

# Bottom-left = Animation
tmux send-keys -t "$SESSION:0.1" "$ANIMATION" C-m

# Select top-left clean terminal
tmux select-pane -t "$SESSION:0.0"

# Layout
tmux select-layout -t "$SESSION:0" tiled

# Start
clear
exec tmux attach-session -t "$SESSION"
