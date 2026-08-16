/*
 * DemCord Settings Tab
 */

import { openNotificationLogModal } from "@api/Notifications/notificationLog";
import { useSettings } from "@api/Settings";
import { Divider } from "@components/Divider";
import { FormSwitch } from "@components/FormSwitch";
import { FolderIcon, LogIcon, PaintbrushIcon, RestartIcon } from "@components/Icons";
import { QuickAction, QuickActionCard } from "@components/settings/QuickAction";
import { SettingsTab, wrapTab } from "@components/settings/tabs/BaseTab";
import { openPluginModal } from "@components/settings/tabs/plugins/PluginModal";
import SettingsPlugin from "@plugins/_core/settings";
import { IS_WINDOWS } from "@utils/constants";
import { Margins } from "@utils/margins";
import { relaunch } from "@utils/native";
import { ConfirmModal, Forms, openModal, React } from "@webpack/common";
import { MacOSVibrancySettings } from "./MacVibrancySettings";
import { NotificationSection } from "./NotificationSettings";
import { WindowsMaterialSettings } from "./WindowsMaterialSettings";

type KeysOfType<Object, Type> = {
    [K in keyof Object]: Object[K] extends Type ? K : never;
}[keyof Object];

function CoreSwitches() {
    const settings = useSettings(["useQuickCss", "enableReactDevtools", "frameless", "winNativeTitleBar", "transparent", "winCtrlQ", "disableMinSize"]);
    const Switches = [
        { key: "useQuickCss", title: "Enable Custom CSS" },
        !IS_WEB && { key: "enableReactDevtools", title: "Enable React Developer Tools", restartRequired: true },
        !IS_WEB && (!IS_DISCORD_DESKTOP || !IS_WINDOWS ? { key: "frameless", title: "Disable the window frame", restartRequired: true } : { key: "winNativeTitleBar", title: "Use Windows native title bar", restartRequired: true }),
        !IS_WEB && { key: "transparent", title: "Enable window transparency", description: "Makes Discord panels transparent. Set Background Material to Mica or Acrylic for best results.", restartRequired: true },
        IS_DISCORD_DESKTOP && { key: "disableMinSize", title: "Disable minimum window size", restartRequired: true },
        !IS_WEB && IS_WINDOWS && { key: "winCtrlQ", title: "Register Ctrl+Q to close Discord", restartRequired: true },
    ] satisfies Array<false | { key: KeysOfType<typeof settings, boolean>; title: string; description?: string; restartRequired?: boolean; }>;

    return Switches.map(setting => {
        if (!setting) return null;
        const { key, title, description, restartRequired } = setting;
        return (
            <FormSwitch key={key} title={title} description={description} value={settings[key]} onChange={v => {
                settings[key] = v;
                if (restartRequired) openModal(props => <ConfirmModal {...props} title="Restart Required" subtitle="A restart is required to apply this change" confirmText="Restart now" cancelText="Later!" variant="primary" onConfirm={relaunch} />);
            }} />
        );
    });
}

function AppearanceSettings() {
    const settings = useSettings(["accentColor", "messageFontSize", "avatarShape", "serverIconShape", "hideMutedChannels", "customTitleBarText"] as any);
    return (<>
        <Forms.FormTitle tag="h5">Appearance</Forms.FormTitle>
        <Forms.FormText className={Margins.bottom8}>Custom Accent Color (hex e.g. #a855f7)</Forms.FormText>
        <input
            type="text"
            value={(settings as any).accentColor || ""}
            onChange={(e: any) => { (settings as any).accentColor = e.target.value; if (e.target.value) { let el = document.getElementById("dc-accent"); if (!el) { el = document.createElement("style"); el.id = "dc-accent"; document.head.appendChild(el); } el.textContent = `:root { --brand-experiment: ${e.target.value} !important; --brand-500: ${e.target.value} !important; }`; } }}
            style={{ background: "var(--background-secondary)", border: "1px solid var(--background-modifier-accent)", borderRadius: "8px", color: "var(--text-normal)", padding: "8px 12px", width: "100%", marginBottom: "16px" }}
            placeholder="#a855f7"
        />
        <Forms.FormText className={Margins.bottom8}>Message Font Size: {(settings as any).messageFontSize || 14}px</Forms.FormText>
        <input
            type="range" min="12" max="20"
            value={(settings as any).messageFontSize || 14}
            onChange={(e: any) => {
                (settings as any).messageFontSize = Number(e.target.value);
                let el = document.getElementById("dc-fontsize");
                if (!el) { el = document.createElement("style"); el.id = "dc-fontsize"; document.head.appendChild(el); }
                el.textContent = `[class*="messageContent"], [class*="markup"] { font-size: ${e.target.value}px !important; }`;
            }}
            style={{ width: "100%", marginBottom: "16px", accentColor: "#a855f7" }}
        />
        <Forms.FormText className={Margins.bottom8}>Avatar Shape</Forms.FormText>
        <select
            value={(settings as any).avatarShape || "round"}
            onChange={(e: any) => {
                (settings as any).avatarShape = e.target.value;
                let el = document.getElementById("dc-avatarshape");
                if (!el) { el = document.createElement("style"); el.id = "dc-avatarshape"; document.head.appendChild(el); }
                const r = e.target.value === "round" ? "50%" : e.target.value === "square" ? "4px" : "30%";
                el.textContent = `[class*="avatar"] { border-radius: ${r} !important; }`;
            }}
            style={{ background: "var(--background-secondary)", border: "1px solid var(--background-modifier-accent)", borderRadius: "8px", color: "var(--text-normal)", padding: "8px 12px", width: "100%", marginBottom: "16px" }}
        >
            <option value="round">Round</option>
            <option value="square">Square</option>
            <option value="squircle">Squircle</option>
        </select>
        <Forms.FormText className={Margins.bottom8}>Server Icon Shape</Forms.FormText>
        <select
            value={(settings as any).serverIconShape || "round"}
            onChange={(e: any) => {
                (settings as any).serverIconShape = e.target.value;
                let el = document.getElementById("dc-servershape");
                if (!el) { el = document.createElement("style"); el.id = "dc-servershape"; document.head.appendChild(el); }
                const r = e.target.value === "round" ? "50%" : e.target.value === "square" ? "4px" : "30%";
                el.textContent = `[class*="guildIcon"], [class*="blob"] { border-radius: ${r} !important; }`;
            }}
            style={{ background: "var(--background-secondary)", border: "1px solid var(--background-modifier-accent)", borderRadius: "8px", color: "var(--text-normal)", padding: "8px 12px", width: "100%", marginBottom: "16px" }}
        >
            <option value="round">Round</option>
            <option value="square">Square</option>
            <option value="squircle">Squircle</option>
        </select>
        <Forms.FormText className={Margins.bottom8}>Custom Title Bar Text</Forms.FormText>
        <input
            type="text"
            value={(settings as any).customTitleBarText || ""}
            onChange={(e: any) => { (settings as any).customTitleBarText = e.target.value; if (e.target.value) document.title = e.target.value; }}
            style={{ background: "var(--background-secondary)", border: "1px solid var(--background-modifier-accent)", borderRadius: "8px", color: "var(--text-normal)", padding: "8px 12px", width: "100%", marginBottom: "16px" }}
            placeholder="DemCord"
        />
        <FormSwitch
            title="Hide Muted Channels"
            description="Completely hide muted channels from sidebar"
            value={(settings as any).hideMutedChannels || false}
            onChange={(v: boolean) => {
                (settings as any).hideMutedChannels = v;
                let el = document.getElementById("dc-hidemuted");
                if (!el) { el = document.createElement("style"); el.id = "dc-hidemuted"; document.head.appendChild(el); }
                el.textContent = v ? `[class*="channel"][class*="muted"] { display: none !important; }` : "";
            }}
        />
    </>);
}

function BehaviorSettings() {
    const settings = useSettings(["confirmClose", "middleClickCloseDM", "doubleClickEdit", "autoCollapseCategories"] as any);
    return (<>
        <Forms.FormTitle tag="h5">Behavior</Forms.FormTitle>
        <FormSwitch title="Confirm Before Closing" description="Show a confirmation dialog before closing Discord" value={(settings as any).confirmClose || false} onChange={(v: boolean) => { (settings as any).confirmClose = v; }} />
        <FormSwitch title="Middle-Click to Close DMs" description="Close DMs with middle mouse button click" value={(settings as any).middleClickCloseDM || false} onChange={(v: boolean) => { (settings as any).middleClickCloseDM = v; }} />
        <FormSwitch title="Double-Click to Edit Message" description="Double-click your own messages to edit them instantly" value={(settings as any).doubleClickEdit || false} onChange={(v: boolean) => {
            (settings as any).doubleClickEdit = v;
            if (v) {
                document.addEventListener("dblclick", (e: any) => {
                    const msg = e.target?.closest?.("[class*='message']");
                    if (msg) msg.querySelector?.("[class*='editButton']")?.click();
                });
            }
        }} />
        <FormSwitch title="Auto-Collapse Inactive Categories" description="Automatically collapse server categories you are not active in" value={(settings as any).autoCollapseCategories || false} onChange={(v: boolean) => { (settings as any).autoCollapseCategories = v; }} />
    </>);
}

function NotificationSettings2() {
    const settings = useSettings(["muteInVoiceNotifs"] as any);
    return (<>
        <Forms.FormTitle tag="h5">Notification Settings</Forms.FormTitle>
        <FormSwitch title="Suppress Notifications in Voice" description="Mute all DemCord notifications while you are in a voice channel" value={(settings as any).muteInVoiceNotifs !== false} onChange={(v: boolean) => { (settings as any).muteInVoiceNotifs = v; }} />
    </>);
}

function PrivacySettings() {
    const settings = useSettings(["hideOnlineFromUsers", "blockNonFriendDMs", "hideActivityStatus", "noGameTracking"] as any);
    return (<>
        <Forms.FormTitle tag="h5">Privacy</Forms.FormTitle>
        <FormSwitch title="Hide Activity Status" description="Hide what game or app you are using from everyone" value={(settings as any).hideActivityStatus || false} onChange={(v: boolean) => { (settings as any).hideActivityStatus = v; }} />
        <FormSwitch title="Block DMs from Non-Friends" description="Automatically ignore message requests from users who are not your friends" value={(settings as any).blockNonFriendDMs || false} onChange={(v: boolean) => { (settings as any).blockNonFriendDMs = v; }} />
        <FormSwitch title="Hide Online Status from Non-Friends" description="Appear offline to users who are not on your friends list" value={(settings as any).hideOnlineFromUsers === "all"} onChange={(v: boolean) => { (settings as any).hideOnlineFromUsers = v ? "all" : ""; }} />
        <FormSwitch title="Disable Game Activity Tracking" description="Prevent Discord from detecting and displaying your games in your status" value={(settings as any).noGameTracking || false} onChange={(v: boolean) => { (settings as any).noGameTracking = v; }} />
    </>);
}

function DemCordSettings() {
    return (
        <SettingsTab>
            <section>
                <Forms.FormTitle tag="h5">Quick Actions</Forms.FormTitle>
                <QuickActionCard>
                    <QuickAction Icon={LogIcon} text="Notification Log" action={openNotificationLogModal} />
                    <QuickAction Icon={PaintbrushIcon} text="Edit QuickCSS" action={() => VencordNative.quickCss.openEditor()} />
                    {!IS_WEB && (<>
                        <QuickAction Icon={RestartIcon} text="Relaunch Discord" action={relaunch} />
                        <QuickAction Icon={FolderIcon} text="Open Settings Folder" action={() => VencordNative.settings.openFolder()} />
                    </>)}
                </QuickActionCard>
            </section>
            <Divider />
            <section className={Margins.top16}>
                <Forms.FormTitle tag="h5">Settings</Forms.FormTitle>
                <Forms.FormText className={Margins.bottom20} style={{ color: "var(--text-muted)" }}>
                    Hint: You can change the position of this settings section in the{" "}
                    <a onClick={() => openPluginModal(SettingsPlugin)}>settings of the Settings plugin</a>!
                </Forms.FormText>
                <CoreSwitches />
            </section>
            <MacOSVibrancySettings />
            <WindowsMaterialSettings />
            <Divider />
            <section className={Margins.top16}><AppearanceSettings /></section>
            <Divider />
            <section className={Margins.top16}><BehaviorSettings /></section>
            <Divider />
            <section className={Margins.top16}><NotificationSettings2 /></section>
            <Divider />
            <section className={Margins.top16}><PrivacySettings /></section>
            <NotificationSection />
        </SettingsTab>
    );
}

export default wrapTab(DemCordSettings, "DemCord Settings");
