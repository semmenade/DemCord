import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";
import { Forms, React, useState } from "@webpack/common";

const settings = definePluginSettings({
    accounts: {
        type: OptionType.STRING,
        description: "Saved accounts JSON (managed automatically)",
        default: "[]",
        hidden: true
    },
    hotkey1: { type: OptionType.STRING, description: "Hotkey for account 1 (e.g. ctrl+1)", default: "ctrl+1" },
    hotkey2: { type: OptionType.STRING, description: "Hotkey for account 2 (e.g. ctrl+2)", default: "ctrl+2" },
    hotkey3: { type: OptionType.STRING, description: "Hotkey for account 3 (e.g. ctrl+3)", default: "ctrl+3" },
});

function getAccounts() {
    try { return JSON.parse(settings.store.accounts); } catch { return []; }
}

function saveAccounts(accounts: any[]) {
    settings.store.accounts = JSON.stringify(accounts);
}

function switchTo(token: string) {
    try {
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        document.body.appendChild(iframe);
        localStorage.setItem("token", `"${token}"`);
        showNotification({ title: "TokenRotator", body: "Switching account..." });
        setTimeout(() => window.location.reload(), 500);
    } catch(e) { console.error("[TokenRotator]", e); }
}

export default definePlugin({
    name: "TokenRotator",
    description: "Switch between multiple Discord accounts instantly with hotkeys",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    _keyHandler: null as any,

    start() {
        this._keyHandler = (e: KeyboardEvent) => {
            const accounts = getAccounts();
            const combo = `${e.ctrlKey?"ctrl+":""}${e.altKey?"alt+":""}${e.key}`;
            const idx = [settings.store.hotkey1, settings.store.hotkey2, settings.store.hotkey3].indexOf(combo);
            if (idx >= 0 && accounts[idx]) {
                e.preventDefault();
                switchTo(accounts[idx].token);
            }
        };
        document.addEventListener("keydown", this._keyHandler);
    },

    stop() {
        if (this._keyHandler) document.removeEventListener("keydown", this._keyHandler);
    }
});
