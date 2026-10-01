import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    token: { type: OptionType.STRING, description: "GitHub personal access token (optional for higher rate limits)", default: "" }
});

export default definePlugin({
    name: "GitHubIntegration",
    description: "Look up GitHub repos, issues, and user profiles directly in Discord",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    commands: [
        {
            name: "github-repo",
            description: "Get info about a GitHub repository",
            options: [{ name: "repo", description: "owner/repo e.g. semmenade/DemCord", type: 3, required: true }],
            async execute(opts) {
                const repo = opts.find((o: any) => o.name === "repo")?.value;
                try {
                    const res = await fetch(`https://api.github.com/repos/${repo}`);
                    const data = await res.json();
                    if (data.message) return { content: `Repo not found: ${repo}` };
                    return { content: `**${data.full_name}**\n${data.description || "No description"}\nStars: ${data.stargazers_count} | Forks: ${data.forks_count} | Issues: ${data.open_issues_count}\n${data.html_url}` };
                } catch { return { content: `Could not fetch repo: ${repo}` }; }
            }
        },
        {
            name: "github-user",
            description: "Get info about a GitHub user",
            options: [{ name: "username", description: "GitHub username", type: 3, required: true }],
            async execute(opts) {
                const username = opts.find((o: any) => o.name === "username")?.value;
                try {
                    const res = await fetch(`https://api.github.com/users/${username}`);
                    const data = await res.json();
                    if (data.message) return { content: `User not found: ${username}` };
                    return { content: `**${data.name || username}**\n${data.bio || "No bio"}\nFollowers: ${data.followers} | Repos: ${data.public_repos}\n${data.html_url}` };
                } catch { return { content: `Could not fetch user: ${username}` }; }
            }
        }
    ]
});
