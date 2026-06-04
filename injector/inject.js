const fs   = require('fs');
const fse  = require('fs-extra');
const path = require('path');
const os   = require('os');
const { spawnSync } = require('child_process');

function findDiscord() {
  // Build paths from homedir — works in both Node and Electron
  const home  = os.homedir();
  const local = path.join(home, 'AppData', 'Local');
  const roam  = path.join(home, 'AppData', 'Roaming');

  for (const root of [local, roam]) {
    for (const name of ['Discord','DiscordPTB','DiscordCanary','DiscordDevelopment']) {
      try {
        const base = path.join(root, name);
        if (!fs.existsSync(base)) continue;

        // Get all versioned folders, sort newest first
        const entries = fs.readdirSync(base);
        const versions = entries
          .filter(d => {
            try { return /^app-[\d.]+$/.test(d) && fs.statSync(path.join(base,d)).isDirectory(); }
            catch(_) { return false; }
          })
          .sort((a,b) => {
            const an = a.replace('app-','').split('.').map(Number);
            const bn = b.replace('app-','').split('.').map(Number);
            for (let i=0;i<4;i++) if((bn[i]||0)!==(an[i]||0)) return (bn[i]||0)-(an[i]||0);
            return 0;
          });

        if (!versions.length) continue;

        for (const v of versions) {
          const resources = path.join(base, v, 'resources');
          const asar      = path.join(resources, 'app.asar');
          try {
            if (fs.existsSync(asar) && fs.statSync(asar).size > 100000) {
              const location = path.join(local, name);
              const bi       = path.join(resources, 'build_info.json');
              let version    = 'Unknown';
              try { version  = JSON.parse(fs.readFileSync(bi,'utf8')).version || 'Unknown'; } catch(_) {}
              return { name, resources, asar, location, version };
            }
          } catch(_) {}
        }
      } catch(_) {}
    }
  }
  return null;
}

function isRunning() {
  try {
    for (const n of ['Discord.exe','DiscordPTB.exe','DiscordCanary.exe']) {
      const r = spawnSync('tasklist',['/FI',`IMAGENAME eq ${n}`,'/NH'],{encoding:'utf8'});
      if (r.stdout && r.stdout.toLowerCase().includes(n.toLowerCase())) return true;
    }
  } catch(_) {}
  return false;
}

function kill() {
  for (const n of ['Discord.exe','DiscordPTB.exe','DiscordCanary.exe','DiscordDevelopment.exe'])
    try { spawnSync('taskkill',['/F','/IM',n],{encoding:'utf8'}); } catch(_) {}
}

function isPatched(resources) {
  return fs.existsSync(path.join(resources,'app.asar.orig'));
}

function inject(resources, demcordDir) {
  const asar       = require('@electron/asar');
  const asarPath   = path.join(resources,'app.asar');
  const backupPath = path.join(resources,'app.asar.orig');
  const tmpDir     = path.join(resources,'_dc_tmp');
  const steps      = [];

  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(asarPath, backupPath);
    steps.push('OK: backed up app.asar');
  } else {
    fs.copyFileSync(backupPath, asarPath);
    steps.push('OK: restored clean backup');
  }

  if (fs.existsSync(tmpDir)) fse.removeSync(tmpDir);
  asar.extractAll(asarPath, tmpDir);
  steps.push('OK: extracted asar');

  const bundlePath = path.join(tmpDir,'bundle.js');
  if (!fs.existsSync(bundlePath)) throw new Error('bundle.js not found — unsupported Discord version');

  const pluginsDir  = path.join(demcordDir,'plugins');
  const themesDir   = path.join(demcordDir,'themes');
  const settingsDir = path.join(demcordDir,'settings');
  fse.ensureDirSync(pluginsDir);
  fse.ensureDirSync(themesDir);
  fse.ensureDirSync(settingsDir);

  const original = fs.readFileSync(bundlePath,'utf8');
  const patch    = buildPatch(pluginsDir, themesDir, settingsDir);
  fs.writeFileSync(bundlePath, patch + '\n' + original);
  steps.push('OK: patched bundle.js');

  const repack = spawnSync('node',['-e',
    `require('@electron/asar').createPackage(${JSON.stringify(tmpDir)},${JSON.stringify(asarPath)}).then(()=>{process.stdout.write('ok');process.exit(0);}).catch(e=>{process.stderr.write(String(e));process.exit(1);});`
  ],{encoding:'utf8',timeout:30000});
  if (repack.status !== 0) throw new Error('Repack failed: '+(repack.stderr||repack.stdout));
  steps.push('OK: repacked asar');

  fse.removeSync(tmpDir);
  const appDir = path.join(resources,'app');
  if (fs.existsSync(appDir)) fse.removeSync(appDir);
  steps.push('Done — launch Discord now');
  return steps;
}

function unpatch(resources) {
  const asarPath   = path.join(resources,'app.asar');
  const backupPath = path.join(resources,'app.asar.orig');
  const appDir     = path.join(resources,'app');
  const tmpDir     = path.join(resources,'_dc_tmp');
  if (fs.existsSync(appDir))     fse.removeSync(appDir);
  if (fs.existsSync(tmpDir))     fse.removeSync(tmpDir);
  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, asarPath);
    fs.unlinkSync(backupPath);
  }
}

function buildPatch(pluginsDir, themesDir, settingsDir) {
  const ui = JSON.stringify(rendererUI(pluginsDir, themesDir, settingsDir));
  return `
// ===== DEMCORD START =====
try {
  const _fs=require('fs'),_pt=require('path'),_el=require('electron');
  const _PD=${JSON.stringify(pluginsDir)},_TD=${JSON.stringify(themesDir)};
  const _SD=${JSON.stringify(settingsDir)},_SF=${JSON.stringify(path.join(settingsDir,'settings.json'))};
  function _rs(){try{return JSON.parse(_fs.readFileSync(_SF,'utf8'));}catch(_){return{plugins:{},theme:null};}}
  _el.app.on('browser-window-created',(_,win)=>{
    win.webContents.on('did-finish-load',()=>{
      const s=_rs();
      if(s.theme){const f=_pt.join(_TD,s.theme);if(_fs.existsSync(f))win.webContents.insertCSS(_fs.readFileSync(f,'utf8')).catch(()=>{});}
      if(_fs.existsSync(_PD)){_fs.readdirSync(_PD).filter(f=>f.endsWith('.js')).forEach(p=>{
        if(s.plugins&&s.plugins[p]){try{win.webContents.executeJavaScript(_fs.readFileSync(_pt.join(_PD,p),'utf8')).catch(()=>{});}catch(_){}}
      });}
      win.webContents.executeJavaScript(${ui}).catch(()=>{});
    });
  });
} catch(e){console.error('[DemCord]',e);}
// ===== DEMCORD END =====
`;
}

function rendererUI(pluginsDir, themesDir, settingsDir) {
  return `(function(){
if(window.__dc)return;window.__dc=true;
const fs=require('fs'),path=require('path');
const PD=${JSON.stringify(pluginsDir)},TD=${JSON.stringify(themesDir)},SD=${JSON.stringify(settingsDir)};
const SF=path.join(SD,'settings.json');
function rs(){try{return JSON.parse(fs.readFileSync(SF,'utf8'));}catch(_){return{plugins:{},theme:null};}}
function ss(s){try{fs.mkdirSync(SD,{recursive:true});fs.writeFileSync(SF,JSON.stringify(s,null,2));}catch(_){}}
(function(){const s=rs();if(!s.theme)return;const f=path.join(TD,s.theme);if(!fs.existsSync(f))return;let el=document.getElementById('_dct');if(!el){el=document.createElement('style');el.id='_dct';document.head.appendChild(el);}el.textContent=fs.readFileSync(f,'utf8');})();
const obs=new MutationObserver(()=>{
  const sb=document.querySelector('[class*="sidebar"] [class*="scroller"]');
  if(!sb||document.getElementById('_dcbtn'))return;
  if(!sb.querySelectorAll('[class*="item"],[class*="header"]').length)return;
  const hr=document.createElement('div');hr.style.cssText='height:1px;background:rgba(255,255,255,0.08);margin:8px 6px;';
  const hd=document.createElement('div');hd.textContent='DemCord';hd.style.cssText='font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#a09ab8;padding:8px 10px 4px;';
  const btn=document.createElement('div');btn.id='_dcbtn';
  btn.style.cssText='padding:6px 10px;border-radius:4px;cursor:pointer;color:#dcddde;font-size:14px;display:flex;align-items:center;gap:8px;transition:background .1s;user-select:none;';
  btn.innerHTML='<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><polygon points="8,1 15,5 15,11 8,15 1,11 1,5" stroke="#a855f7" stroke-width="1.5" fill="none"/></svg>DemCord';
  btn.onmouseenter=()=>{btn.style.background='rgba(255,255,255,0.06)';};
  btn.onmouseleave=()=>{btn.style.background='';};
  btn.onclick=showPanel;
  sb.appendChild(hr);sb.appendChild(hd);sb.appendChild(btn);
});
obs.observe(document.body,{childList:true,subtree:true});
function showPanel(){
  const area=document.querySelector('[class*="contentRegion"] [class*="contentColumn"]')||document.querySelector('[class*="contentRegion"]');
  if(!area)return;
  const s=rs();
  const themes=fs.existsSync(TD)?fs.readdirSync(TD).filter(f=>f.endsWith('.css')):[];
  const plugins=fs.existsSync(PD)?fs.readdirSync(PD).filter(f=>f.endsWith('.js')):[];
  area.innerHTML='';
  const w=document.createElement('div');
  w.style.cssText='padding:40px;max-width:700px;font-family:"Segoe UI",sans-serif;color:#f0eeff;';
  w.innerHTML=\`
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:8px;">
      <svg width="32" height="32" viewBox="0 0 28 28" fill="none"><polygon points="14,2 26,8.5 26,19.5 14,26 2,19.5 2,8.5" stroke="#a855f7" stroke-width="2" fill="rgba(168,85,247,0.12)"/><polygon points="14,7 21,11 21,17 14,21 7,17 7,11" stroke="#a855f7" stroke-width="1.2" fill="rgba(168,85,247,0.18)"/></svg>
      <div><div style="font-size:22px;font-weight:800;">DemCord</div><div style="font-size:12px;color:#625c78;margin-top:2px;">Custom Discord mod</div></div>
    </div>
    <div style="height:1px;background:rgba(255,255,255,0.08);margin:20px 0 28px;"></div>
    <div style="margin-bottom:32px;">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#a09ab8;margin-bottom:14px;">Theme</div>
      <div style="display:flex;gap:10px;">
        <select id="_dcts" style="flex:1;padding:9px 12px;background:#18181f;border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#f0eeff;font-size:13px;outline:none;cursor:pointer;">
          <option value="">None</option>
          \${themes.map(t=>\`<option value="\${t}" \${s.theme===t?'selected':''}>\${t}</option>\`).join('')}
        </select>
        <button id="_dcta" style="padding:9px 20px;background:#a855f7;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;">Apply</button>
      </div>
      <div style="font-size:11px;color:#5a546e;margin-top:8px;">Drop .css files into your DemCord themes folder then reopen this panel.</div>
    </div>
    <div style="height:1px;background:rgba(255,255,255,0.08);margin-bottom:28px;"></div>
    <div>
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#a09ab8;margin-bottom:14px;">Plugins</div>
      \${plugins.length?plugins.map(p=>{const on=!!(s.plugins&&s.plugins[p]);return \`
        <div style="display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:8px;margin-bottom:8px;">
          <div><div style="font-size:13px;font-weight:600;">\${p}</div><div style="font-size:11px;color:#5a546e;margin-top:2px;">JS Plugin</div></div>
          <div onclick="window.__dctog('\${p}')" style="width:40px;height:22px;border-radius:20px;background:\${on?'#a855f7':'rgba(255,255,255,0.1)'};cursor:pointer;position:relative;transition:background .2s;flex-shrink:0;">
            <div style="width:16px;height:16px;border-radius:50%;background:#fff;position:absolute;top:3px;\${on?'left:21px':'left:3px'};transition:left .2s;box-shadow:0 1px 3px rgba(0,0,0,0.3);"></div>
          </div>
        </div>\`;}).join(''):'<div style="color:#5a546e;font-size:13px;">No plugins found. Drop .js files into your DemCord plugins folder.</div>'}
    </div>
    <div id="_dcmsg" style="font-size:12px;color:#22c55e;margin-top:20px;min-height:18px;"></div>
  \`;
  area.appendChild(w);
  document.getElementById('_dcta').onclick=()=>{
    const val=document.getElementById('_dcts').value;const s2=rs();s2.theme=val||null;ss(s2);
    let el=document.getElementById('_dct');if(!el){el=document.createElement('style');el.id='_dct';document.head.appendChild(el);}
    el.textContent=val&&fs.existsSync(path.join(TD,val))?fs.readFileSync(path.join(TD,val),'utf8'):'';
    const m=document.getElementById('_dcmsg');if(m){m.textContent=val?'Theme applied!':'Theme removed.';setTimeout(()=>{if(m)m.textContent='';},2000);}
  };
  window.__dctog=p=>{const s2=rs();if(!s2.plugins)s2.plugins={};s2.plugins[p]=!s2.plugins[p];ss(s2);showPanel();};
}
})();`;
}

module.exports = { findDiscord, isRunning, kill, isPatched, inject, unpatch };
