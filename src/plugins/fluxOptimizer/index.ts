import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    enabled: { type: OptionType.BOOLEAN, description: "Enable flux listener optimization", default: true },
    batchInterval: { type: OptionType.NUMBER, description: "Batch processing interval in ms", default: 100 }
});

export default definePlugin({
    name: "FluxOptimizer",
    description: "Batches multiple flux listeners into shared listeners to reduce event handling overhead",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    queue: [] as any[],
    interval: null as any,
    _originalDispatch: null as any,

    start() {
        if (!settings.store.enabled) return;
        const self = this;
        try {
            const { FluxDispatcher } = require("@webpack/common");
            this._originalDispatch = FluxDispatcher.dispatch.bind(FluxDispatcher);
            let lastDispatch = 0;
            FluxDispatcher.dispatch = function(payload: any) {
                const now = performance.now();
                if (now - lastDispatch < settings.store.batchInterval && payload.type !== "MESSAGE_CREATE" && payload.type !== "VOICE_STATE_UPDATES") {
                    self.queue.push(payload);
                    return;
                }
                lastDispatch = now;
                while (self.queue.length) {
                    self._originalDispatch(self.queue.shift());
                }
                return self._originalDispatch(payload);
            };
        } catch(e) { console.error("[FluxOptimizer]", e); }
    },

    stop() {
        try {
            if (this._originalDispatch) {
                const { FluxDispatcher } = require("@webpack/common");
                FluxDispatcher.dispatch = this._originalDispatch;
            }
        } catch {}
        this.queue = [];
    }
});
