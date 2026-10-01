import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    board: { type: OptionType.STRING, description: "Project board data", default: '{"todo":[],"doing":[],"done":[]}', hidden: true }
});
function getBoard() { try { return JSON.parse(settings.store.board); } catch { return { todo: [], doing: [], done: [] }; } }
function saveBoard(b: any) { settings.store.board = JSON.stringify(b); }
export default definePlugin({
    name: "ProjectBoard",
    description: "Kanban style project board built into Discord channels",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    commands: [
        {
            name: "board-add",
            description: "Add a card to the board",
            options: [
                { name: "column", description: "Column: todo doing done", type: 3, required: true },
                { name: "title", description: "Card title", type: 3, required: true }
            ],
            execute(opts) {
                const col = opts.find((o: any) => o.name === "column")?.value;
                const title = opts.find((o: any) => o.name === "title")?.value;
                const board = getBoard();
                if (!board[col]) return { content: `Invalid column: ${col}. Use todo, doing, or done` };
                board[col].push({ title, id: Date.now() });
                saveBoard(board);
                return { content: `Added to ${col}: ${title}` };
            }
        },
        {
            name: "board",
            description: "Show the project board",
            execute() {
                const board = getBoard();
                return { content: `**Project Board**\n\n**TODO:**\n${board.todo.map((c: any) => `- ${c.title}`).join("\n") || "Empty"}\n\n**DOING:**\n${board.doing.map((c: any) => `- ${c.title}`).join("\n") || "Empty"}\n\n**DONE:**\n${board.done.map((c: any) => `- ${c.title}`).join("\n") || "Empty"}` };
            }
        },
        {
            name: "board-move",
            description: "Move a card between columns",
            options: [
                { name: "id", description: "Card ID", type: 10, required: true },
                { name: "to", description: "Destination column: todo doing done", type: 3, required: true }
            ],
            execute(opts) {
                const id = opts.find((o: any) => o.name === "id")?.value;
                const to = opts.find((o: any) => o.name === "to")?.value;
                const board = getBoard();
                let card: any;
                for (const col of ["todo", "doing", "done"]) {
                    const idx = board[col].findIndex((c: any) => c.id === id);
                    if (idx >= 0) { card = board[col].splice(idx, 1)[0]; break; }
                }
                if (!card) return { content: `Card not found: ${id}` };
                board[to].push(card);
                saveBoard(board);
                return { content: `Moved "${card.title}" to ${to}` };
            }
        }
    ]
});
