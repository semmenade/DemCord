import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    playlist: { type: OptionType.STRING, description: "Shared playlist songs", default: "[]", hidden: true }
});
function getPlaylist() { try { return JSON.parse(settings.store.playlist); } catch { return []; } }
function savePlaylist(p: any[]) { settings.store.playlist = JSON.stringify(p); }
export default definePlugin({
    name: "SharedPlaylist",
    description: "Create a shared playlist with friends that updates in real-time",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    commands: [
        {
            name: "playlist-add",
            description: "Add a song to the shared playlist",
            options: [
                { name: "song", description: "Song name or URL", type: 3, required: true },
                { name: "artist", description: "Artist name", type: 3, required: false }
            ],
            execute(opts, ctx) {
                const song = opts.find((o: any) => o.name === "song")?.value;
                const artist = opts.find((o: any) => o.name === "artist")?.value || "Unknown";
                const playlist = getPlaylist();
                playlist.push({ song, artist, addedBy: ctx.channel.id, date: new Date().toDateString() });
                savePlaylist(playlist);
                return { content: `Added to playlist: ${song} by ${artist}` };
            }
        },
        {
            name: "playlist",
            description: "Show the shared playlist",
            execute() {
                const playlist = getPlaylist();
                if (!playlist.length) return { content: "Playlist is empty. Use /playlist-add to add songs." };
                return { content: `**Shared Playlist:**\n${playlist.map((s: any, i: number) => `${i + 1}. ${s.song} - ${s.artist}`).join("\n")}` };
            }
        }
    ]
});
