#!/bin/bash
echo "================================"
echo "       DemCord Installer        "
echo "================================"
echo ""

# Detect arch
ARCH=$(uname -m)
if [ "$ARCH" = "x86_64" ]; then
    BIN="DemCordInstallerCli-linux-amd64"
elif [ "$ARCH" = "aarch64" ]; then
    BIN="DemCordInstallerCli-linux-arm64"
else
    echo "Unsupported architecture: $ARCH"
    exit 1
fi

# Download installer binary
RELEASE_URL="https://github.com/semmenade/DemCord/releases/latest/download"
echo "Downloading DemCord installer for $ARCH..."
curl -L "$RELEASE_URL/$BIN" -o /tmp/DemCordInstaller
chmod +x /tmp/DemCordInstaller

# Create settings dir
mkdir -p "$HOME/.config/demcord/themes"
mkdir -p "$HOME/.config/demcord/plugins"
mkdir -p "$HOME/.config/demcord/settings"

# Download dist files
echo "Downloading DemCord files..."
curl -L "$RELEASE_URL/patcher.js" -o "$HOME/.config/demcord/patcher.js"
curl -L "$RELEASE_URL/preload.js" -o "$HOME/.config/demcord/preload.js"
curl -L "$RELEASE_URL/renderer.js" -o "$HOME/.config/demcord/renderer.js"
curl -L "$RELEASE_URL/renderer.css" -o "$HOME/.config/demcord/renderer.css"

# Run installer
echo "Injecting DemCord into Discord..."
DEMCORD_USER_DATA_DIR="$HOME/.config/demcord" DEMCORD_DEV_INSTALL=1 /tmp/DemCordInstaller --install

# Setup watcher as systemd service
echo "Setting up auto-reinject watcher..."
mkdir -p "$HOME/.config/systemd/user"
cat > "$HOME/.config/systemd/user/demcord-watcher.service" << EOF
[Unit]
Description=DemCord Auto-Reinject Watcher
After=network.target

[Service]
Type=simple
ExecStart=/bin/bash -c 'while true; do sleep 30; if [ -d "$HOME/.local/share/Discord" ]; then DEMCORD_USER_DATA_DIR=$HOME/.config/demcord DEMCORD_DEV_INSTALL=1 /tmp/DemCordInstaller --install 2>/dev/null; fi; done'
Restart=always

[Install]
WantedBy=default.target
EOF

systemctl --user daemon-reload
systemctl --user enable demcord-watcher
systemctl --user start demcord-watcher

echo ""
echo "================================"
echo "  DemCord installed successfully!"
echo "================================"
echo ""
echo "Restart Discord to apply changes."
