#!/bin/bash

RED='\033[0;31m'
PURPLE='\033[0;35m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

# Show ASCII art
ASCII_URL="https://github.com/semmenade/DemCord/releases/latest/download/demcord-ascii.txt"
echo -e "${PURPLE}"
curl -sL "$ASCII_URL" 2>/dev/null || echo "DemCord Installer"
echo -e "${NC}"

RELEASE_URL="https://github.com/semmenade/DemCord/releases/latest/download"
CONFIG_DIR="$HOME/Library/Application Support/demcord"
ARCH=$(uname -m)

if [ "$ARCH" = "x86_64" ]; then
    BIN="DemCordInstallerCli-mac-amd64"
elif [ "$ARCH" = "arm64" ]; then
    BIN="DemCordInstallerCli-mac-arm64"
else
    echo -e "${RED}Unsupported architecture: $ARCH${NC}"
    exit 1
fi

echo -e "${CYAN}Detecting Discord installation...${NC}"

DISCORD_PATH=""
for path in \
    "/Applications/Discord.app" \
    "$HOME/Applications/Discord.app"
do
    if [ -d "$path" ]; then
        DISCORD_PATH="$path"
        echo -e "${GREEN}Found Discord at: $path${NC}"
        break
    fi
done

if [ -z "$DISCORD_PATH" ]; then
    echo -e "${RED}Discord not found. Please install Discord first.${NC}"
    echo "Download from: https://discord.com/download"
    exit 1
fi

mkdir -p "$CONFIG_DIR/themes"
mkdir -p "$CONFIG_DIR/settings"
mkdir -p "$CONFIG_DIR/plugins"

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

echo -n "  Downloading installer binary... "
if curl -sL "$RELEASE_URL/$BIN" -o /tmp/DemCordInstaller; then
    chmod +x /tmp/DemCordInstaller
    echo -e "${GREEN}done${NC}"
else
    echo -e "${RED}failed${NC}"
    exit 1
fi

echo -e "${CYAN}Injecting DemCord into Discord...${NC}"
DEMCORD_USER_DATA_DIR="$CONFIG_DIR" DEMCORD_DEV_INSTALL=1 /tmp/DemCordInstaller --install

echo -e "${CYAN}Setting up auto-reinject watcher...${NC}"
PLIST="$HOME/Library/LaunchAgents/dev.demcord.watcher.plist"
cat > "$PLIST" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>dev.demcord.watcher</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>-c</string>
        <string>while true; do sleep 30; DEMCORD_USER_DATA_DIR="$CONFIG_DIR" DEMCORD_DEV_INSTALL=1 /tmp/DemCordInstaller --install 2>/dev/null; done</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
EOF
launchctl load "$PLIST" 2>/dev/null
echo -e "${GREEN}Watcher installed${NC}"

echo ""
echo -e "${PURPLE}================================${NC}"
echo -e "${GREEN}  DemCord installed successfully!${NC}"
echo -e "${PURPLE}================================${NC}"
echo ""
echo "Restart Discord to apply changes."
echo ""

read -p "Restart Discord now? (y/n): " restart
if [ "$restart" = "y" ] || [ "$restart" = "Y" ]; then
    pkill -x Discord 2>/dev/null
    sleep 2
    open -a Discord
    echo -e "${GREEN}Discord restarted with DemCord!${NC}"
fi
