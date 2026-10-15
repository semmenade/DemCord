const express = require("express");
const WebSocket = require("ws");
const QRCode = require("qrcode");
const path = require("path");
const fs = require("fs");
const http = require("http");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;
const RELEASE_URL = "https://github.com/semmenade/DemCord/releases/latest/download";

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());

// Track active installs
const sessions = new Map();

// WebSocket for real-time step progression
wss.on("connection", (ws, req) => {
    const sessionId = Date.now().toString();
    sessions.set(sessionId, { ws, step: 0, platform: null });
    ws.send(JSON.stringify({ type: "connected", sessionId }));

    ws.on("message", async (data) => {
        const msg = JSON.parse(data);
        const session = sessions.get(msg.sessionId || sessionId);
        if (!session) return;

        switch(msg.type) {
            case "permission_granted":
                session.platform = msg.platform;
                session.step = 1;
                ws.send(JSON.stringify({ type: "step", step: 1, message: "Downloading DemCord..." }));
                await startInstall(session, ws);
                break;
            case "step_complete":
                session.step++;
                await nextStep(session, ws);
                break;
        }
    });

    ws.on("close", () => sessions.delete(sessionId));
});

async function startInstall(session, ws) {
    if (session.platform === "android") {
        ws.send(JSON.stringify({ type: "step", step: 1, action: "download_apk", url: `${RELEASE_URL}/DemCord-Android.apk`, message: "Downloading patched Discord APK..." }));
    } else if (session.platform === "ios") {
        ws.send(JSON.stringify({ type: "step", step: 1, action: "install_profile", url: "/demcord.mobileconfig", message: "Installing DemCord certificate..." }));
    }
}

async function nextStep(session, ws) {
    const { platform, step } = session;
    if (platform === "android") {
        const steps = [
            null,
            { action: "install_apk", message: "Install the downloaded APK. Tap Install when prompted." },
            { action: "open_discord", message: "Opening Discord with DemCord active..." },
            { action: "complete", message: "DemCord installed successfully!" }
        ];
        if (steps[step]) ws.send(JSON.stringify({ type: "step", step, ...steps[step] }));
    } else if (platform === "ios") {
        const steps = [
            null,
            { action: "trust_profile", message: "Go to Settings > General > VPN & Device Management and trust DemCord." },
            { action: "download_ipa", url: "/DemCord-iOS.ipa", message: "Downloading DemCord IPA..." },
            { action: "open_altstore", message: "Opening AltStore to install..." },
            { action: "complete", message: "DemCord installed successfully!" }
        ];
        if (steps[step]) ws.send(JSON.stringify({ type: "step", step, ...steps[step] }));
    }
}

// QR code endpoint
app.get("/qr", async (req, res) => {
    const host = req.headers.host;
    const url = `http://${host}/install`;
    const qr = await QRCode.toDataURL(url, { color: { dark: "#a855f7", light: "#0d0010" }, width: 300 });
    res.json({ qr, url });
});

// Device detection and redirect
app.get("/install", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/install.html"));
});

// Serve mobileconfig for iOS
app.get("/demcord.mobileconfig", (req, res) => {
    res.setHeader("Content-Type", "application/x-apple-aspen-config");
    res.sendFile(path.join(__dirname, "../public/demcord.mobileconfig"));
});

// Download stats
app.post("/api/stats", (req, res) => {
    console.log(`[Stats] Platform: ${req.body.platform}, Step: ${req.body.step}`);
    res.json({ ok: true });
});

server.listen(PORT, () => {
    console.log(`[DemCord Mobile Installer] Running on port ${PORT}`);
});
