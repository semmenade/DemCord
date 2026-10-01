import definePlugin from "@utils/types";
export default definePlugin({
    name: "SpotifyParty",
    description: "Share what you are listening to and let friends join your Spotify session",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "spotify-share",
        description: "Share your current Spotify track",
        execute() {
            return { content: "Enable Spotify activity in Discord settings to show your current track, then use /spotify-share to share it here." };
        }
    }]
});
