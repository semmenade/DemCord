const fs   = require('fs');
const fse  = require('fs-extra');
const path = require('path');
const asar = require('@electron/asar');
const { spawnSync } = require('child_process');

const asarPath    = process.env.ASAR;
const backupPath  = process.env.BACKUP;
const tmpDir      = process.env.TMP;
const pluginsDir  = process.env.PLUGINS;
const themesDir   = process.env.THEMES;
const settingsDir = process.env.SETTINGS;
const settingsFile = path.join(settingsDir, 'settings.json');

fs.copyFileSync(backupPath, asarPath);
if (fs.existsSync(tmpDir)) fse.removeSync(tmpDir);
asar.extractAll(asarPath, tmpDir);

const bundlePath = path.join(tmpDir, 'bundle.js');
const original   = fs.readFileSync(bundlePath, 'utf8');

const uiCode = '(function(){' +
'if(window.__dc)return;window.__dc=true;' +
'var fs=require("fs"),path=require("path");' +
'var PD=' + JSON.stringify(pluginsDir) + ',TD=' + JSON.stringify(themesDir) + ',SD=' + JSON.stringify(settingsDir) + ',SF=' + JSON.stringify(settingsFile) + ';' +
'function rs(){try{return JSON.parse(fs.readFileSync(SF,"utf8"));}catch(e){return{plugins:{},theme:null};}}' +
'function ss(s){try{fs.mkdirSync(SD,{recursive:true});fs.writeFileSync(SF,JSON.stringify(s,null,2));}catch(e){}}' +
'(function(){var s=rs();if(!s.theme)return;var f=path.join(TD,s.theme);if(!fs.existsSync(f))return;var el=document.getElementById("_dct");if(!el){el=document.createElement("style");el.id="_dct";document.head.appendChild(el);}el.textContent=fs.readFileSync(f,"utf8");})();' +
'function insertNav(){' +
'if(document.getElementById("_dcbtn"))return;' +
'var all=Array.from(document.querySelectorAll("[class*=\\"sidebar\\"] [class*=\\"item\\"]"));' +
'var clips=all.find(function(el){return el.textContent.trim()==="Clips";});' +
'if(!clips)return;' +
'var hr=document.createElement("div");hr.style.cssText="height:1px;background:rgba(255,255,255,0.08);margin:4px 8px;";' +
'var hd=document.createElement("div");hd.textContent="DemCord";hd.style.cssText="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#a09ab8;padding:8px 10px 4px;";' +
'var btn=document.createElement("div");btn.id="_dcbtn";' +
'btn.style.cssText="padding:6px 10px;border-radius:4px;cursor:pointer;color:#dcddde;font-size:14px;display:flex;align-items:center;gap:8px;transition:background .1s;user-select:none;";' +
'btn.innerHTML="<svg width=\\"14\\" height=\\"14\\" viewBox=\\"0 0 16 16\\" fill=\\"none\\"><polygon points=\\"8,1 15,5 15,11 8,15 1,11 1,5\\" stroke=\\"#a855f7\\" stroke-width=\\"1.5\\" fill=\\"none\\"/></svg>DemCord";' +
'btn.onmouseenter=function(){btn.style.background="rgba(255,255,255,0.06)";};' +
'btn.onmouseleave=function(){btn.style.background="";};' +
'btn.onclick=showPanel;' +
'clips.insertAdjacentElement("afterend",btn);' +
'clips.insertAdjacentElement("afterend",hd);' +
'clips.insertAdjacentElement("afterend",hr);' +
'}' +
'var obs=new MutationObserver(insertNav);' +
'obs.observe(document.body,{childList:true,subtree:true});' +
'function showPanel(){' +
'var area=document.querySelector("[class*=\\"contentRegion\\"] [class*=\\"contentColumn\\"]")||document.querySelector("[class*=\\"contentRegion\\"]");' +
'if(!area)return;' +
'var s=rs();' +
'var themes=fs.existsSync(TD)?fs.readdirSync(TD).filter(function(f){return f.endsWith(".css");}):[];' +
'var plugins=fs.existsSync(PD)?fs.readdirSync(PD).filter(function(f){return f.endsWith(".js");}):[];' +
'area.innerHTML="";' +
'var w=document.createElement("div");' +
'w.style.cssText="padding:40px;max-width:700px;font-family:Segoe UI,sans-serif;color:#f0eeff;";' +
'var themeOpts=themes.map(function(t){return "<option value=\\""+t+"\\" "+(s.theme===t?"selected":"")+">"+t+"</option>";}).join("");' +
'var pluginRows=plugins.length?plugins.map(function(p){var on=!!(s.plugins&&s.plugins[p]);return "<div style=\\"display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:8px;margin-bottom:8px;\\"><div><div style=\\"font-size:13px;font-weight:600;\\">"+p+"</div><div style=\\"font-size:11px;color:#5a546e;margin-top:2px;\\">JS Plugin</div></div><div onclick=\\"window.__dctog(\'"+p+"\')\\" style=\\"width:40px;height:22px;border-radius:20px;background:"+(on?"#a855f7":"rgba(255,255,255,0.1)")+";cursor:pointer;position:relative;transition:background .2s;flex-shrink:0;\\"><div style=\\"width:16px;height:16px;border-radius:50%;background:#fff;position:absolute;top:3px;"+(on?"left:21px":"left:3px")+";transition:left .2s;\\"></div></div></div>";}).join(""):"<div style=\\"color:#5a546e;font-size:13px;\\">No plugins found.</div>";' +
'w.innerHTML="<div style=\\"display:flex;align-items:center;gap:14px;margin-bottom:8px;\\"><svg width=\\"32\\" height=\\"32\\" viewBox=\\"0 0 28 28\\" fill=\\"none\\"><polygon points=\\"14,2 26,8.5 26,19.5 14,26 2,19.5 2,8.5\\" stroke=\\"#a855f7\\" stroke-width=\\"2\\" fill=\\"rgba(168,85,247,0.12)\\"/><polygon points=\\"14,7 21,11 21,17 14,21 7,17 7,11\\" stroke=\\"#a855f7\\" stroke-width=\\"1.2\\" fill=\\"rgba(168,85,247,0.18)\\"/></svg><div><div style=\\"font-size:22px;font-weight:800;\\">DemCord</div><div style=\\"font-size:12px;color:#625c78;margin-top:2px;\\">Custom Discord mod</div></div></div><div style=\\"height:1px;background:rgba(255,255,255,0.08);margin:20px 0 28px;\\"></div><div style=\\"margin-bottom:32px;\\"><div style=\\"font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#a09ab8;margin-bottom:14px;\\">Theme</div><div style=\\"display:flex;gap:10px;\\"><select id=\\"_dcts\\" style=\\"flex:1;padding:9px 12px;background:#18181f;border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#f0eeff;font-size:13px;outline:none;cursor:pointer;\\"><option value=\\"\\">None</option>"+themeOpts+"</select><button id=\\"_dcta\\" style=\\"padding:9px 20px;background:#a855f7;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;\\">Apply</button></div><div style=\\"font-size:11px;color:#5a546e;margin-top:8px;\\">Drop .css files into your DemCord themes folder.</div></div><div style=\\"height:1px;background:rgba(255,255,255,0.08);margin-bottom:28px;\\"></div><div><div style=\\"font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#a09ab8;margin-bottom:14px;\\">Plugins</div>"+pluginRows+"</div><div id=\\"_dcmsg\\" style=\\"font-size:12px;color:#22c55e;margin-top:20px;min-height:18px;\\"></div>";' +
'area.appendChild(w);' +
'document.getElementById("_dcta").onclick=function(){' +
'var val=document.getElementById("_dcts").value;var s2=rs();s2.theme=val||null;ss(s2);' +
'var el=document.getElementById("_dct");if(!el){el=document.createElement("style");el.id="_dct";document.head.appendChild(el);}' +
'el.textContent=val&&fs.existsSync(path.join(TD,val))?fs.readFileSync(path.join(TD,val),"utf8"):"";' +
'var m=document.getElementById("_dcmsg");if(m){m.textContent=val?"Theme applied!":"Theme removed.";setTimeout(function(){if(m)m.textContent="";},2000);}' +
'};' +
'window.__dctog=function(p){var s2=rs();if(!s2.plugins)s2.plugins={};s2.plugins[p]=!s2.plugins[p];ss(s2);showPanel();};' +
'}' +
'})()';

const patch = '// ===== DEMCORD START =====\n' +
'try {\n' +
'  var _fs=require("fs"),_pt=require("path"),_el=require("electron");\n' +
'  var _PD=' + JSON.stringify(pluginsDir) + ',_TD=' + JSON.stringify(themesDir) + ';\n' +
'  var _SD=' + JSON.stringify(settingsDir) + ',_SF=' + JSON.stringify(settingsFile) + ';\n' +
'  function _rs(){try{return JSON.parse(_fs.readFileSync(_SF,"utf8"));}catch(_){return{plugins:{},theme:null};}}\n' +
'  _el.app.on("browser-window-created",function(_,win){\n' +
'    win.webContents.on("did-finish-load",function(){\n' +
'      var s=_rs();\n' +
'      if(s.theme){var f=_pt.join(_TD,s.theme);if(_fs.existsSync(f))win.webContents.insertCSS(_fs.readFileSync(f,"utf8")).catch(function(){});}\n' +
'      if(_fs.existsSync(_PD)){_fs.readdirSync(_PD).filter(function(f){return f.endsWith(".js");}).forEach(function(p){\n' +
'        if(s.plugins&&s.plugins[p]){try{win.webContents.executeJavaScript(_fs.readFileSync(_pt.join(_PD,p),"utf8")).catch(function(){});}catch(_){}}\n' +
'      });}\n' +
'      win.webContents.executeJavaScript(' + JSON.stringify(uiCode) + ').catch(function(){});\n' +
'    });\n' +
'  });\n' +
'} catch(e){console.error("[DemCord]",e);}\n' +
'// ===== DEMCORD END =====\n';

fs.writeFileSync(bundlePath, patch + '\n' + original);
console.log('Patched bundle.js');

const r = spawnSync('node', ['-e',
  'require("@electron/asar").createPackage(' + JSON.stringify(tmpDir) + ',' + JSON.stringify(asarPath) + ').then(function(){process.stdout.write("ok");process.exit(0);}).catch(function(e){process.stderr.write(String(e));process.exit(1);});'
], { encoding: 'utf8', timeout: 30000 });

console.log(r.status === 0 ? 'Repacked OK' : 'FAILED: ' + r.stderr);
fse.removeSync(tmpDir);
console.log('Done - restart Discord');
