const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const discordPath = path.join(process.env.LOCALAPPDATA, 'Discord');
const installer = path.join(__dirname, 'dist', 'Installer', 'VencordInstallerCli.exe');

let lastVersion = '';

function getLatestVersion() {
    try {
        return fs.readdirSync(discordPath)
            .filter(d => d.startsWith('app-'))
            .sort()
            .pop();
    } catch { return ''; }
}

function inject() {
    try {
        console.log('[DemCord] Reinjecting...');
        execFileSync(installer, [], {
            env: { ...process.env, VENCORD_USER_DATA_DIR: __dirname, VENCORD_DEV_INSTALL: '1' },
            stdio: 'inherit'
        });
        console.log('[DemCord] Injected successfully');
    } catch(e) {
        console.error('[DemCord] Inject failed:', e.message);
    }
}

lastVersion = getLatestVersion();
console.log('[DemCord Watcher] Watching for Discord updates...');
console.log('[DemCord Watcher] Current version:', lastVersion);

setInterval(() => {
    const current = getLatestVersion();
    if (current && current !== lastVersion) {
        console.log('[DemCord] Discord updated to', current, '- reinjecting');
        lastVersion = current;
        setTimeout(inject, 5000);
    }
}, 10000);
