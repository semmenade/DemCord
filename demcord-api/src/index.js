const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const WebSocket = require("ws");
const http = require("http");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

const DB_PATH = path.join(__dirname, "../db");
const USERS_FILE = path.join(DB_PATH, "users.json");
const BANS_FILE = path.join(DB_PATH, "bans.json");
const STATS_FILE = path.join(DB_PATH, "stats.json");

// Ensure db directory exists
if (!fs.existsSync(DB_PATH)) fs.mkdirSync(DB_PATH, { recursive: true });

function readDB(file, def = {}) {
    try { return JSON.parse(fs.readFileSync(file, "utf8")); } 
    catch { return def; }
}
function writeDB(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

const ROLES = ["founder", "cofounder", "manager", "admin", "mod", "vip", "mains", "buyer", "user"];
const ROLE_HIERARCHY = { founder: 9, cofounder: 8, manager: 7, admin: 6, mod: 5, vip: 4, mains: 3, buyer: 2, user: 1 };

// Admin API key - change this
const ADMIN_KEY = process.env.ADMIN_KEY || "demcord-admin-secret-change-me";

function authAdmin(req, res, next) {
    if (req.headers["x-admin-key"] !== ADMIN_KEY) return res.status(401).json({ error: "Unauthorized" });
    next();
}

// Active users tracking
const activeUsers = new Map();

// WebSocket for real-time count
wss.on("connection", (ws, req) => {
    ws.on("message", (data) => {
        try {
            const msg = JSON.parse(data);
            if (msg.type === "heartbeat" && msg.userId) {
                activeUsers.set(msg.userId, Date.now());
                ws.send(JSON.stringify({ type: "ack" }));
            }
        } catch {}
    });
    ws.on("close", () => {});
    ws.send(JSON.stringify({ type: "connected", activeUsers: activeUsers.size }));
});

// Clean inactive users every 2 minutes
setInterval(() => {
    const now = Date.now();
    for (const [id, time] of activeUsers.entries()) {
        if (now - time > 120000) activeUsers.delete(id);
    }
    // Broadcast updated count
    wss.clients.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "count", count: activeUsers.size }));
        }
    });
}, 30000);

// ============ PUBLIC ROUTES ============

// Register new user on install
app.post("/api/register", (req, res) => {
    const { discordId, username, deviceId, version } = req.body;
    if (!discordId) return res.status(400).json({ error: "Missing discordId" });
    
    const users = readDB(USERS_FILE, {});
    const bans = readDB(BANS_FILE, {});
    
    // Check if banned
    if (bans[discordId]) {
        return res.status(403).json({ 
            banned: true, 
            message: `${username || discordId} has been banned from using DemCord. Request an appeal at https://discord.gg/cybernet`,
            reason: bans[discordId].reason,
            bannedAt: bans[discordId].bannedAt
        });
    }
    
    const isNew = !users[discordId];
    
    if (isNew) {
        users[discordId] = {
            discordId,
            username: username || "Unknown",
            deviceId: deviceId || uuidv4(),
            role: "user",
            joinedAt: new Date().toISOString(),
            lastSeen: new Date().toISOString(),
            version: version || "unknown",
            dp: 0
        };
    } else {
        users[discordId].lastSeen = new Date().toISOString();
        users[discordId].username = username || users[discordId].username;
        users[discordId].version = version || users[discordId].version;
    }
    
    writeDB(USERS_FILE, users);
    
    // Update stats
    const stats = readDB(STATS_FILE, { totalInstalls: 0, totalUsers: 0 });
    if (isNew) { stats.totalInstalls++; stats.totalUsers = Object.keys(users).length; }
    writeDB(STATS_FILE, stats);
    
    activeUsers.set(discordId, Date.now());
    
    res.json({
        success: true,
        isNew,
        user: {
            discordId,
            username: users[discordId].username,
            role: users[discordId].role,
            dp: users[discordId].dp,
            joinedAt: users[discordId].joinedAt
        }
    });
});

// Check user status
app.get("/api/user/:discordId", (req, res) => {
    const { discordId } = req.params;
    const users = readDB(USERS_FILE, {});
    const bans = readDB(BANS_FILE, {});
    
    if (bans[discordId]) {
        return res.status(403).json({ 
            banned: true, 
            message: `${users[discordId]?.username || discordId} has been banned from using DemCord. Request an appeal at https://discord.gg/cybernet`
        });
    }
    
    if (!users[discordId]) return res.status(404).json({ error: "User not found" });
    
    const user = users[discordId];
    res.json({
        discordId: user.discordId,
        username: user.username,
        role: user.role,
        dp: user.dp,
        joinedAt: user.joinedAt
    });
});

// Real-time stats endpoint
app.get("/api/stats", (req, res) => {
    const stats = readDB(STATS_FILE, { totalInstalls: 0, totalUsers: 0 });
    const users = readDB(USERS_FILE, {});
    res.json({
        activeUsers: activeUsers.size,
        totalUsers: Object.keys(users).length,
        totalInstalls: stats.totalInstalls
    });
});

// ============ ADMIN ROUTES ============

// Get all users
app.get("/api/admin/users", authAdmin, (req, res) => {
    const users = readDB(USERS_FILE, {});
    res.json(Object.values(users));
});

// Set user role
app.post("/api/admin/role", authAdmin, (req, res) => {
    const { discordId, role } = req.body;
    if (!ROLES.includes(role)) return res.status(400).json({ error: "Invalid role" });
    const users = readDB(USERS_FILE, {});
    if (!users[discordId]) return res.status(404).json({ error: "User not found" });
    users[discordId].role = role;
    writeDB(USERS_FILE, users);
    res.json({ success: true, user: users[discordId] });
});

// Ban user
app.post("/api/admin/ban", authAdmin, (req, res) => {
    const { discordId, reason } = req.body;
    const bans = readDB(BANS_FILE, {});
    const users = readDB(USERS_FILE, {});
    bans[discordId] = { 
        reason: reason || "Violation of DemCord Terms of Service",
        bannedAt: new Date().toISOString(),
        bannedBy: "admin"
    };
    writeDB(BANS_FILE, bans);
    res.json({ success: true, message: `${users[discordId]?.username || discordId} has been banned` });
});

// Unban user
app.post("/api/admin/unban", authAdmin, (req, res) => {
    const { discordId } = req.body;
    const bans = readDB(BANS_FILE, {});
    delete bans[discordId];
    writeDB(BANS_FILE, bans);
    res.json({ success: true });
});

// Update DP balance
app.post("/api/admin/dp", authAdmin, (req, res) => {
    const { discordId, amount } = req.body;
    const users = readDB(USERS_FILE, {});
    if (!users[discordId]) return res.status(404).json({ error: "User not found" });
    users[discordId].dp = (users[discordId].dp || 0) + amount;
    writeDB(USERS_FILE, users);
    res.json({ success: true, newBalance: users[discordId].dp });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`[DemCord API] Running on port ${PORT}`));

