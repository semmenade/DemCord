import { useSettings } from "@api/Settings";
import { Divider } from "@components/Divider";
import { FormSwitch } from "@components/FormSwitch";
import { SettingsTab, wrapTab } from "@components/settings/tabs/BaseTab";
import { Margins } from "@utils/margins";
import { Forms, React } from "@webpack/common";

function SecurityScore() {
    const settings = useSettings([
        "plugins.TokenDefender.enabled",
        "plugins.AntiPhish.enabled",
        "plugins.IPProtector.enabled",
        "plugins.SessionManager.enabled",
        "plugins.AntiGhostPing.enabled",
        "plugins.TwoFactorReminder.enabled",
        "plugins.BreachMonitor.enabled",
        "plugins.AntiTokenLog.enabled",
        "plugins.ClipboardGuard.enabled",
        "plugins.SafeLinkOpener.enabled"
    ] as any);

    const securityPlugins = [
        "TokenDefender","AntiPhish","IPProtector","SessionManager",
        "AntiGhostPing","TwoFactorReminder","BreachMonitor","AntiTokenLog",
        "ClipboardGuard","SafeLinkOpener"
    ];

    const enabled = securityPlugins.filter(p => (settings as any).plugins?.[p]?.enabled).length;
    const score = Math.round((enabled / securityPlugins.length) * 100);
    const color = score >= 80 ? "#22c55e" : score >= 50 ? "#eab308" : "#ef4444";
    const label = score >= 80 ? "Strong" : score >= 50 ? "Moderate" : "Weak";

    return React.createElement("div", {
        style: { background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)", borderRadius: "12px", padding: "16px", marginBottom: "16px" }
    },
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" } },
            React.createElement(Forms.FormTitle, { tag: "h5", style: { margin: 0 } }, "Security Score"),
            React.createElement("span", { style: { color, fontWeight: 700, fontSize: "18px" } }, `${score}% - ${label}`)
        ),
        React.createElement("div", { style: { background: "rgba(0,0,0,0.3)", borderRadius: "4px", height: "8px", overflow: "hidden" } },
            React.createElement("div", { style: { width: `${score}%`, height: "100%", background: color, borderRadius: "4px", transition: "width 0.3s" } })
        ),
        React.createElement(Forms.FormText, { style: { marginTop: "8px", fontSize: "12px" } }, `${enabled}/${securityPlugins.length} security plugins active`)
    );
}

function SecuritySection({ title, children }: { title: string; children: React.ReactNode }) {
    return React.createElement(React.Fragment, null,
        React.createElement(Forms.FormTitle, { tag: "h5", className: Margins.top16 }, title),
        children,
        React.createElement(Divider)
    );
}

function SecurityToggle({ pluginName, title, description }: { pluginName: string; title: string; description: string }) {
    const settings = useSettings([`plugins.${pluginName}.enabled`] as any);
    return React.createElement(FormSwitch, {
        title,
        description,
        value: (settings as any).plugins?.[pluginName]?.enabled ?? false,
        onChange: (v: boolean) => {
            const s = settings as any;
            s.plugins ??= {};
            s.plugins[pluginName] ??= {};
            s.plugins[pluginName].enabled = v;
        }
    });
}

function DemCordSecurity() {
    return React.createElement(SettingsTab, null,
        React.createElement(SecurityScore),

        React.createElement(SecuritySection, { title: "Core Protection" },
            React.createElement(SecurityToggle, { pluginName: "TokenDefender", title: "Token Defender", description: "Blocks attempts to steal your Discord token in real-time" }),
            React.createElement(SecurityToggle, { pluginName: "AntiTokenLog", title: "Anti Token Logger", description: "Prevents scripts from logging your token to the console" }),
            React.createElement(SecurityToggle, { pluginName: "ClipboardGuard", title: "Clipboard Guard", description: "Warns before pasting anything that looks like a token or password" }),
            React.createElement(SecurityToggle, { pluginName: "SessionManager", title: "Session Manager", description: "Monitors active sessions and alerts on new device logins" })
        ),

        React.createElement(SecuritySection, { title: "Link & File Protection" },
            React.createElement(SecurityToggle, { pluginName: "AntiPhish", title: "Anti Phishing", description: "Scans links against known phishing databases before you click" }),
            React.createElement(SecurityToggle, { pluginName: "IPProtector", title: "IP Protector", description: "Blocks links that could expose your IP address" }),
            React.createElement(SecurityToggle, { pluginName: "SafeLinkOpener", title: "Safe Link Opener", description: "Confirms before opening any external link" })
        ),

        React.createElement(SecuritySection, { title: "Account Security" },
            React.createElement(SecurityToggle, { pluginName: "TwoFactorReminder", title: "Two Factor Reminder", description: "Warns if 2FA is disabled on your account" }),
            React.createElement(SecurityToggle, { pluginName: "BreachMonitor", title: "Breach Monitor", description: "Alerts if your email appears in known data breaches" }),
            React.createElement(SecurityToggle, { pluginName: "AccountAgeWarner", title: "Account Age Warner", description: "Warns when DMing accounts under 7 days old" }),
            React.createElement(SecurityToggle, { pluginName: "AutoLogout", title: "Auto Logout", description: "Warns and optionally logs out after extended inactivity" })
        ),

        React.createElement(SecuritySection, { title: "Message Security" },
            React.createElement(SecurityToggle, { pluginName: "AntiGhostPing", title: "Anti Ghost Ping", description: "Detects when someone mentions you and deletes the message" }),
            React.createElement(SecurityToggle, { pluginName: "AntiSpam", title: "Anti Spam", description: "Blocks users who spam you in DMs" }),
            React.createElement(SecurityToggle, { pluginName: "DMRequestFilter", title: "DM Request Filter", description: "Auto-declines DMs from accounts younger than a set age" }),
            React.createElement(SecurityToggle, { pluginName: "MessageEncryption", title: "Message Encryption", description: "End-to-end encrypt messages between DemCord users" })
        ),

        React.createElement(SecuritySection, { title: "Server Security" },
            React.createElement(SecurityToggle, { pluginName: "AntiNuke", title: "Anti Nuke", description: "Detects mass channel deletion role deletion or ban attacks" }),
            React.createElement(SecurityToggle, { pluginName: "AntiRAID", title: "Anti Raid", description: "Detects and alerts on mass join events" }),
            React.createElement(SecurityToggle, { pluginName: "AntiSelfBot", title: "Anti Self Bot", description: "Detects potential self-bot activity in your servers" }),
            React.createElement(SecurityToggle, { pluginName: "HoneypotDM", title: "Honeypot DM", description: "Alerts if anyone triggers your honeypot keyword" })
        ),

        React.createElement(SecuritySection, { title: "Privacy" },
            React.createElement(SecurityToggle, { pluginName: "ScreenshotBlocker", title: "Screenshot Detector", description: "Detects and warns when a screenshot is taken" }),
            React.createElement(SecurityToggle, { pluginName: "ScreenshotWatermarker", title: "Screenshot Watermarker", description: "Adds invisible watermark to screenshots" }),
            React.createElement(SecurityToggle, { pluginName: "AntiScreenShare", title: "Anti Screen Share", description: "Blurs sensitive info when screensharing" }),
            React.createElement(SecurityToggle, { pluginName: "TelemetryReducer", title: "Telemetry Reducer", description: "Reduces Discord analytics and telemetry calls" }),
            React.createElement(SecurityToggle, { pluginName: "FakeTokenGen", title: "Fake Token Generator", description: "Generates fake tokens to fool token scrapers" })
        )
    );
}

export default wrapTab(DemCordSecurity, "Security");
