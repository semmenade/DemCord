import definePlugin from "@utils/types";
export default definePlugin({
    name: "InvoiceGenerator",
    description: "Create simple invoices and send as text in Discord",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "invoice",
        description: "Generate a simple invoice",
        options: [
            { name: "client", description: "Client name", type: 3, required: true },
            { name: "amount", description: "Amount due", type: 3, required: true },
            { name: "description", description: "Service description", type: 3, required: true }
        ],
        execute(opts) {
            const client = opts.find((o: any) => o.name === "client")?.value;
            const amount = opts.find((o: any) => o.name === "amount")?.value;
            const description = opts.find((o: any) => o.name === "description")?.value;
            const date = new Date().toDateString();
            return { content: `**INVOICE**\nDate: ${date}\nClient: ${client}\nService: ${description}\nAmount Due: ${amount}\nThank you for your business.` };
        }
    }]
});
