const { ipcRenderer } = require('electron');

function ipc(ch) { ipcRenderer.send(ch); }
function ts() { return new Date().toTimeString().slice(0,8); }
function log(msg, type='info') {
  const box = document.getElementById('log');
  const el  = document.createElement('div');
  el.className = 'll ' + type;
  el.innerHTML = `<span class="lt">[${ts()}]</span><span class="lm">${msg}</span>`;
  box.appendChild(el);
  box.scrollTop = box.scrollHeight;
}

let dcInfo = null;

async function checkRunning() {
  const r = await ipcRenderer.invoke('running');
  const w = document.getElementById('warn');
  r ? w.classList.add('show') : w.classList.remove('show');
  return r;
}

async function scan() {
  dcInfo = await ipcRenderer.invoke('find');
  const box = document.getElementById('infobox');
  const bi  = document.getElementById('btn-install');
  const br  = document.getElementById('btn-repair');
  const bu  = document.getElementById('btn-uninstall');

  if (!dcInfo) {
    box.innerHTML = '<div style="color:var(--t3);font-size:13px;">No Discord installation found. Make sure Discord is installed.</div>';
    bi.disabled = br.disabled = bu.disabled = true;
    log('No Discord found.', 'err');
    return;
  }

  box.innerHTML = `
    <div class="row">
      <span class="label">Installation</span>
      <span class="val">${dcInfo.name.replace('DiscordPTB','Discord PTB').replace('DiscordCanary','Discord Canary')}</span>
    </div>
    <div class="row">
      <span class="label">Location</span>
      <span class="val" style="font-family:Consolas;font-size:12px;color:var(--t2);">${dcInfo.location}</span>
    </div>
    <div class="row">
      <span class="label">Discord Version</span>
      <span class="val">${dcInfo.version}</span>
    </div>
    <div class="row">
      <span class="label">Status</span>
      <span class="badge ${dcInfo.patched ? 'patched' : 'clean'}">${dcInfo.patched ? 'Patched' : 'Not Patched'}</span>
    </div>`;

  bi.disabled = false;
  br.disabled = !dcInfo.patched;
  bu.disabled = !dcInfo.patched;
  log('Found: ' + dcInfo.name + ' v' + dcInfo.version + ' — ' + (dcInfo.patched ? 'already patched' : 'ready to patch'), 'ok');
}

async function doInstall() {
  if (await checkRunning()) { log('Close Discord before installing.', 'err'); return; }
  setButtons(true);
  log('Installing DemCord...');
  const r = await ipcRenderer.invoke('inject');
  if (r.steps) for (const s of r.steps) { log(s, s.startsWith('Done') || s.startsWith('OK') ? 'ok' : 'info'); await sleep(100); }
  if (!r.success) log('Failed: ' + r.error, 'err');
  setButtons(false);
  scan();
}

async function doRepair() {
  if (await checkRunning()) { log('Close Discord before repairing.', 'err'); return; }
  setButtons(true);
  log('Reinstalling DemCord...');
  const r = await ipcRenderer.invoke('inject');
  if (r.steps) for (const s of r.steps) { log(s, s.startsWith('Done') || s.startsWith('OK') ? 'ok' : 'info'); await sleep(100); }
  if (!r.success) log('Failed: ' + r.error, 'err');
  setButtons(false);
  scan();
}

async function doUninstall() {
  if (await checkRunning()) { log('Close Discord before uninstalling.', 'err'); return; }
  setButtons(true);
  log('Removing DemCord...');
  const r = await ipcRenderer.invoke('unpatch');
  log(r.success ? 'Uninstalled successfully.' : 'Failed: ' + r.error, r.success ? 'ok' : 'err');
  setButtons(false);
  scan();
}

async function killDc() {
  const kb = document.getElementById('kill-btn');
  kb.disabled = true; kb.textContent = 'Closing...';
  log('Force closing Discord...');
  await ipcRenderer.invoke('kill');
  await sleep(2500);
  await checkRunning();
  await scan();
  kb.disabled = false; kb.textContent = 'Force Close';
}

async function recheck() {
  const rb = document.getElementById('recheck-btn');
  rb.disabled = true; rb.textContent = 'Checking...';
  await sleep(800);
  const r = await checkRunning();
  rb.disabled = false; rb.textContent = 'Re-check';
  if (!r) { log('Discord is closed. Ready.', 'ok'); await scan(); }
  else log('Discord is still running.', 'err');
}

function setButtons(dis) {
  ['btn-install','btn-repair','btn-uninstall'].forEach(id => {
    const b = document.getElementById(id);
    if (b) b.disabled = dis;
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

window.addEventListener('DOMContentLoaded', async () => {
  await checkRunning();
  await scan();
  log('DemCord Installer ready', 'info');
});
setInterval(checkRunning, 4000);
