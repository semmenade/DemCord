import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";

export default definePlugin({
    name: "ProfileVisitors",
    description: "Shows a notification when someone views your profile",
    authors: [{ name: "DemCord", id: 0n }],

    patches: [{
        find: "USER_PROFILE_FETCH_SUCCESS",
        replacement: {
            match: /USER_PROFILE_FETCH_SUCCESS/,
            replace: "USER_PROFILE_FETCH_SUCCESS_DEMCORD"
        }
    }],

    flux: {
        USER_PROFILE_FETCH_SUCCESS_DEMCORD({ user }: any) {
            if (!user) return;
            showNotification({ title: "Profile Visitors", body: `${user.username} viewed your profile` });
        }
    }
});
