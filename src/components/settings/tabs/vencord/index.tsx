/*
 * DemCord, a custom Discord client mod
 * Built from scratch for the DemCord project
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

function Switches() {
    const settings = useSettings(["useQuickCss", "enableReactDevtools", "frameless", "winNativeTitleBar", "transparent", "winCtrlQ", "disableMinSize"]);

    const Switches = [
        {
            key: "useQuickCss",
            title: "Enable Custom CSS",
        },
        !IS_WEB && {
            key: "enableReactDevtools",
            title: "Enable React Developer Tools",
            restartRequired: true
        },
        !IS_WEB && (!IS_DISCORD_DESKTOP || !IS_WINDOWS ? {
            key: "frameless",
            title: "Disable the window frame",
            restartRequired: true
        } : {
            key: "winNativeTitleBar",
            title: "Use Windows' native title bar instead of Discord's custom one",
            restartRequired: true
        }),
        !IS_WEB && {
            key: "transparent",
            title: "Enable window transparency",
            description: "A theme that supports transparency is required or this will do nothing.",
            restartRequired: true
        },
        IS_DISCORD_DESKTOP && {
            key: "disableMinSize",
            title: "Disable minimum window size",
            restartRequired: true
        },
        !IS_WEB && IS_WINDOWS && {
            key: "winCtrlQ",
            title: "Register Ctrl+Q as shortcut to close Discord (Alternative to Alt+F4)",
            restartRequired: true
        },
    ] satisfies Array<false | {
        key: KeysOfType<typeof settings, boolean>;
        title: string;
        description?: string;
        restartRequired?: boolean;
    }>;

    return Switches.map(setting => {
        if (!setting) return null;
        const { key, title, description, restartRequired } = setting;
        return (
            <FormSwitch
                key={key}
                title={title}
                description={description}
                value={settings[key]}
                onChange={v => {
                    settings[key] = v;
                    if (restartRequired) {
                        openModal(props => (
                            <ConfirmModal
                                {...props}
                                title="Restart Required"
                                subtitle="A restart is required to apply this change"
                                confirmText="Restart now"
                                cancelText="Later!"
                                variant="primary"
                                onConfirm={relaunch}
                            />
                        ));
                    }
                }}
            />
        );
    });
}

function DemCordSettings() {
    return (
        <SettingsTab>
            <section>
                <Forms.FormTitle tag="h5">Quick Actions</Forms.FormTitle>
                <QuickActionCard>
                    <QuickAction
                        Icon={LogIcon}
                        text="Notification Log"
                        action={openNotificationLogModal}
                    />
                    <QuickAction
                        Icon={PaintbrushIcon}
                        text="Edit QuickCSS"
                        action={() => VencordNative.quickCss.openEditor()}
                    />
                    {!IS_WEB && (
                        <>
                            <QuickAction
                                Icon={RestartIcon}
                                text="Relaunch Discord"
                                action={relaunch}
                            />
                            <QuickAction
                                Icon={FolderIcon}
                                text="Open Settings Folder"
                                action={() => VencordNative.settings.openFolder()}
                            />
                        </>
                    )}
                </QuickActionCard>
            </section>

            <Divider />

            <section className={Margins.top16}>
                <Forms.FormTitle tag="h5">Settings</Forms.FormTitle>
                <Forms.FormText className={Margins.bottom20} style={{ color: "var(--text-muted)" }}>
                    Hint: You can change the position of this settings section in the{" "}
                    <a onClick={() => openPluginModal(SettingsPlugin)}>
                        settings of the Settings plugin
                    </a>!
                </Forms.FormText>
                <Switches />
            </section>

            <MacOSVibrancySettings />
            <WindowsMaterialSettings />
            <NotificationSection />
        </SettingsTab>
    );
}

export default wrapTab(DemCordSettings, "DemCord Settings");
