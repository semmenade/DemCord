#!/bin/bash

# DemCord Universal Linux Installer
# Supports: Ubuntu/Debian, Arch/Manjaro, Fedora/RHEL, and more

RED='\033[0;31m'
PURPLE='\033[0;35m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${PURPLE}"
# Load custom ASCII art if available
ASCII_URL="https://github.com/semmenade/DemCord/releases/latest/download/demcord-ascii.txt"
ASCII_FILE="/tmp/demcord-ascii.txt"
if curl -sL "$ASCII_URL" -o "$ASCII_FILE" 2>/dev/null; then
    cat "$ASCII_FILE"
else
    echo "================================"
    echo "       DemCord Installer        "
    echo "================================"
fi
echo -e "${NC}"

RELEASE_URL="https://github.com/semmenade/DemCord/releases/latest/download"
CONFIG_DIR="$HOME/.config/demcord"
ARCH=$(uname -m)

# Detect architecture
if [ "$ARCH" = "x86_64" ]; then
    BIN="DemCordInstallerCli-linux-amd64"
elif [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
    BIN="DemCordInstallerCli-linux-arm64"
else
    echo -e "${RED}Unsupported architecture: $ARCH${NC}"
    exit 1
fi

# Detect package manager and install dependencies
echo -e "${CYAN}Detecting your Linux distribution...${NC}"

if command -v apt-get &> /dev/null; then
    DISTRO="debian"
    echo -e "${GREEN}Detected: Ubuntu/Debian${NC}"
    sudo apt-get update -qq
    sudo apt-get install -y curl wget libnotify-bin libappindicator3-1 2>/dev/null

elif command -v pacman &> /dev/null; then
    DISTRO="arch"
    echo -e "${GREEN}Detected: Arch/Manjaro${NC}"
    sudo pacman -Sy --noconfirm curl wget libnotify libappindicator-gtk3 2>/dev/null

elif command -v dnf &> /dev/null; then
    DISTRO="fedora"
    echo -e "${GREEN}Detected: Fedora/RHEL${NC}"
    sudo dnf install -y curl wget libnotify libappindicator 2>/dev/null

elif command -v zypper &> /dev/null; then
    DISTRO="opensuse"
    echo -e "${GREEN}Detected: OpenSUSE${NC}"
    sudo zypper install -y curl wget libnotify 2>/dev/null

elif command -v emerge &> /dev/null; then
    DISTRO="gentoo"
    echo -e "${GREEN}Detected: Gentoo${NC}"

else
    echo -e "${RED}Could not detect package manager. Continuing anyway...${NC}"
    DISTRO="unknown"
fi

# Detect Discord installation
echo -e "${CYAN}Looking for Discord...${NC}"

DISCORD_PATH=""

# Check common Discord locations
for path in \
    "$HOME/.local/share/Discord" \
    "/opt/discord" \
    "/opt/Discord" \
    "/usr/share/discord" \
    "/usr/lib/discord" \
    "$HOME/snap/discord/current/.config/discord" \
    "$HOME/.var/app/com.discordapp.Discord/config/discord"
do
    if [ -d "$path" ]; then
        DISCORD_PATH="$path"
        echo -e "${GREEN}Found Discord at: $path${NC}"
        break
    fi
done

# Check flatpak
if [ -z "$DISCORD_PATH" ] && command -v flatpak &> /dev/null; then
    if flatpak list 2>/dev/null | grep -q "discord"; then
        DISCORD_PATH="flatpak"
        echo -e "${GREEN}Found Discord (Flatpak)${NC}"
    fi
fi

# Check snap
if [ -z "$DISCORD_PATH" ] && command -v snap &> /dev/null; then
    if snap list 2>/dev/null | grep -q "discord"; then
        DISCORD_PATH="snap"
        echo -e "${GREEN}Found Discord (Snap)${NC}"
    fi
fi

if [ -z "$DISCORD_PATH" ]; then
    echo -e "${RED}Discord not found. Please install Discord first.${NC}"
    echo "Download from: https://discord.com/download"
    exit 1
fi

# Create config directory
mkdir -p "$CONFIG_DIR/themes"
mkdir -p "$CONFIG_DIR/settings"
mkdir -p "$CONFIG_DIR/plugins"

# Download DemCord files
echo -e "${CYAN}Downloading DemCord...${NC}"

for file in patcher.js preload.js renderer.js renderer.css; do
    echo -n "  Downloading $file... "
    if curl -sL "$RELEASE_URL/$file" -o "$CONFIG_DIR/$file"; then
        echo -e "${GREEN}done${NC}"
    else
        echo -e "${RED}failed${NC}"
        exit 1
    fi
done

# Download installer binary
echo -n "  Downloading installer binary... "
if curl -sL "$RELEASE_URL/$BIN" -o /tmp/DemCordInstaller; then
    chmod +x /tmp/DemCordInstaller
    echo -e "${GREEN}done${NC}"
else
    echo -e "${RED}failed${NC}"
    exit 1
fi

# Run injection
echo -e "${CYAN}Injecting DemCord into Discord...${NC}"
DEMCORD_USER_DATA_DIR="$CONFIG_DIR" DEMCORD_DEV_INSTALL=1 /tmp/DemCordInstaller --install

# Setup auto-reinject watcher as systemd service
echo -e "${CYAN}Setting up auto-reinject watcher...${NC}"

if command -v systemctl &> /dev/null; then
    mkdir -p "$HOME/.config/systemd/user"
    cat > "$HOME/.config/systemd/user/demcord-watcher.service" << EOF
[Unit]
Description=DemCord Auto-Reinject Watcher
After=network.target

[Service]
Type=simple
ExecStart=/bin/bash -c 'LAST=""; while true; do CURRENT=\$(ls ~/.local/share/Discord/ 2>/dev/null | grep "^app-" | sort | tail -1); if [ "\$CURRENT" != "\$LAST" ] && [ -n "\$CURRENT" ]; then LAST=\$CURRENT; sleep 5; DEMCORD_USER_DATA_DIR=$CONFIG_DIR DEMCORD_DEV_INSTALL=1 /tmp/DemCordInstaller --install 2>/dev/null; fi; sleep 30; done'
Restart=always
RestartSec=10

[Install]
WantedBy=default.target
EOF
    systemctl --user daemon-reload
    systemctl --user enable demcord-watcher
    systemctl --user start demcord-watcher
    echo -e "${GREEN}Watcher service installed and started${NC}"
else
    # Fallback: add to .bashrc for non-systemd systems
    echo "# DemCord Watcher" >> "$HOME/.bashrc"
    echo "nohup bash -c 'while true; do sleep 30; DEMCORD_USER_DATA_DIR=$CONFIG_DIR DEMCORD_DEV_INSTALL=1 /tmp/DemCordInstaller --install 2>/dev/null; done' &>/dev/null &" >> "$HOME/.bashrc"
    echo -e "${GREEN}Watcher added to .bashrc${NC}"
fi

# Create desktop entry
echo -e "${CYAN}Creating desktop integration...${NC}"
mkdir -p "$HOME/.local/share/applications"
cat > "$HOME/.local/share/applications/demcord-settings.desktop" << EOF
[Desktop Entry]
Name=DemCord Settings
Comment=Manage DemCord Discord mod
Exec=bash -c 'xdg-open https://github.com/semmenade/DemCord'
Icon=discord
Terminal=false
Type=Application
Categories=Network;InstantMessaging;
EOF

echo ""
echo -e "${PURPLE}================================${NC}"
echo -e "${GREEN}  DemCord installed successfully!${NC}"
echo -e "${PURPLE}================================${NC}"
echo ""
echo -e "Config directory: ${CYAN}$CONFIG_DIR${NC}"
echo -e "Restart Discord to apply changes."
echo ""

# Offer to restart Discord
read -p "Restart Discord now? (y/n): " restart
if [ "$restart" = "y" ] || [ "$restart" = "Y" ]; then
    pkill -x Discord 2>/dev/null || pkill -x discord 2>/dev/null
    sleep 2
    if command -v discord &> /dev/null; then
        nohup discord &>/dev/null &
    elif [ -f "/usr/bin/Discord" ]; then
        nohup /usr/bin/Discord &>/dev/null &
    fi
    echo -e "${GREEN}Discord restarted with DemCord!${NC}"
fi

