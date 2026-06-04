const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const os   = require('os');

let win;
let injector;

app.whenReady().then(() => {
  // Load injector AFTER app is ready so all env vars are available
  injector = require('../injector/inject');

  win = new BrowserWindow({
    width: 620, height: 580, resizable: false,
    frame: false, backgroundColor: '#1e1e24',
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  });

  win.loadFile(path.join(__dirname, 'index.html'));

  win.webContents.on('did-fail-load', (e, code, desc) => {
    console.error('Window failed to load:', code, desc);
  });
});

app.on('window-all-closed', () => app.quit());

ipcMain.handle('find', () => {
  try {
    const dc = injector.findDiscord();
    if (!dc) return null;
    return {
      name:      dc.name,
      resources: dc.resources,
      location:  path.join(os.homedir(), 'AppData', 'Local', dc.name),
      patched:   injector.isPatched(dc.resources),
      version:   dc.version || 'Unknown'
    };
  } catch(e) {
    console.error('find error:', e);
    return null;
  }
});

ipcMain.handle('running', () => {
  try { return injector.isRunning(); } catch(_) { return false; }
});

ipcMain.handle('kill', () => {
  try { injector.kill(); } catch(_) {}
  return true;
});

ipcMain.handle('inject', async () => {
  try {
    const dc = injector.findDiscord();
    if (!dc) return { success: false, error: 'Discord not found' };
    const DEMCORD_DIR = path.join(__dirname, '..');
    const steps = injector.inject(dc.resources, DEMCORD_DIR);
    return { success: true, steps };
  } catch(e) {
    return { success: false, error: e.message };
  }
});

ipcMain.handle('unpatch', async () => {
  try {
    const dc = injector.findDiscord();
    if (!dc) return { success: false, error: 'Discord not found' };
    injector.unpatch(dc.resources);
    return { success: true };
  } catch(e) {
    return { success: false, error: e.message };
  }
});

ipcMain.on('close',    () => app.quit());
ipcMain.on('minimize', () => win && win.minimize());
