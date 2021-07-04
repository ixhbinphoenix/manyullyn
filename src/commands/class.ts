import { promises as fs } from "fs-extra";

export class BaseCommand {
    name: string | undefined;
    description: string | undefined;
    usage: string | undefined;
}

export async function getCommands(): Promise<Map<string,any>> {
    const builtin: Array<string> = await (await fs.readdir("./src/commands/builtin")).filter((path) => path.endsWith(".js"));
    const custom: Array<string> = await (await fs.readdir("./src/commands/custom")).filter((path) => path.endsWith(".js"));
    const commandMap = new Map();

    builtin.forEach((command: string): void => {
        delete require.cache[require.resolve(`./builtin/${command}`)];
        const cmd = require("./builtin/" + command);
        commandMap.set(cmd.cmd.name, cmd.cmd);
    })
    custom.forEach((command: string): void => {
        delete require.cache[require.resolve(`./custom/${command}`)];
        const cmd = require("./custom/" + command);
        commandMap.set(cmd.cmd.name, cmd.cmd);
    })
    return commandMap;
}