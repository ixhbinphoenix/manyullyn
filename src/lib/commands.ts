import { promises as fs} from "fs-extra";
import { refreshCommands as refresh } from "..";
import { build } from "tsc-prog";
import { getConfig } from "../utils/config";

const config = getConfig();

export function refreshCommands() {
    refresh()
}
export async function createCommand(folder: string) {
    build({
        basePath: __dirname,
        compilerOptions: {
            lib: ["es2020"],
            module: "commonjs",
            target: "es2020",

            strict: true,
            esModuleInterop: true,
            skipLibCheck: true,
            noImplicitAny: true,
            removeComments: true
        },
        include: [folder]
    })
    await refreshCommands();
}
export async function deleteCommand(folder: string, command: string) {
    if (!(await getCommands()).has(command)) { new ReferenceError(`Command ${command} does not exist`) }
    await fs.rm(`${folder}/${command}.js`);
    await fs.rm(`${folder}/${command}.ts`);
    await refreshCommands()
}
export async function getCommands(): Promise<Map<string,any>> {
    const builtin: Array<string> = (await fs.readdir("./src/commands/builtin")).filter((path) => path.endsWith(".js"));
    const custom: Array<string> = (await fs.readdir("./src/commands/custom")).filter((path) => path.endsWith(".js"));
    const commandMap = new Map();

    builtin.forEach((command: string): void => {
        delete require.cache[require.resolve(`../commands/builtin/${command}`)];
        const cmd = require("../commands/builtin/" + command).cmd;
        commandMap.set(cmd.name, cmd);
    })
    custom.forEach((command: string): void => {
        delete require.cache[require.resolve(`../commands/custom/${command}`)];
        const cmd = require("../commands/custom/" + command).cmd;
        commandMap.set(cmd.name, cmd);
    })
    return commandMap;
}
// Only intended for testing, don't use this for commands. (you could tho ;) )
export async function execCommand(user: string, channel: string, message: string) {
    if (message.startsWith(config.prefix)) {
        let cmdmsg = message.substring(config.prefix.length).split(" ");
        const cmd = cmdmsg[0];
        const args = cmdmsg.slice(1);
        let commands = getCommands();
        if ((await commands).get(cmd)) {
            const command = (await commands).get(cmd);
            await command.execute(user, channel, args);
        }
    }
}

export class BaseCommand {
    name: string | undefined;
    description: string | undefined;
    usage: string | undefined;
}