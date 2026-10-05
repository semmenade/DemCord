import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "AntiTokenLog",
    description: "Detects and blocks any attempt to log your token to the console",
    authors: [{ name: "DemCord", id: 0n }],
    _origLog: null as any,
    _origWarn: null as any,
    _origError: null as any,
    start() {
        const self = this;
        const TOKEN_PATTERN = /[\w-]{24}\.[\w-]{6}\.[\w-]{38}/;
        const wrap = (orig: any) => function(...args: any[]) {
            const str = args.join(" ");
            if (TOKEN_PATTERN.test(str)) {
                showNotification({ title: "AntiTokenLog", body: "Something tried to log your token to console - blocked!", color: "#f38ba8", permanent: true });
                return;
            }
            return orig.apply(console, args);
        };
        this._origLog = console.log;
        this._origWarn = console.warn;
        this._origError = console.error;
        console.log = wrap(this._origLog);
        console.warn = wrap(this._origWarn);
        console.error = wrap(this._origError);
    },
    stop() {
        if (this._origLog) console.log = this._origLog;
        if (this._origWarn) console.warn = this._origWarn;
        if (this._origError) console.error = this._origError;
    }
});
