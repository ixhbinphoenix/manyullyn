
import { BaseCommand, getCommands, createCommand, deleteCommand } from "../../lib/commands";
import { isBroadcaster, isMod } from "../../lib/perms";
import { promises as fs, existsSync } from "fs-extra";
import chat from "../../lib/chat";

class cmdCommand extends BaseCommand {
    name = "cmd";
    description = "Create and delete custom commands";
    usage = "cmd <create | delete> <name> [<command text>]";
    execute = async (user: string, channel: string, args: Array<string>) => {
        if (!(await isMod(user, channel) || await isBroadcaster(user, channel))) return;
        if (!args[1]) { await chat.say(channel, `@${user} Not enough arguments. Usage: ${this.usage}`); return; }
        // Checks if command name contains: (){}[];:'"~/\|.,
        let regex = /[\(\)\{\}\[\]\;\:\'\"\~\/\\\|\.\,]/g
        if (regex.exec(args[1])) { await chat.say(channel, `@${user} Command name contains invalid Characters!`); return; }
        switch (args[0]) {
            case "create":
                if (!args[2]) { await chat.say(channel, `@${user} Not enough arguments. Usage: ${this.usage}`); return; }
                if ((await getCommands()).has(args[1])) { await chat.say(channel, `@${user} Command already exists!`); return;}

                let message = args.slice(2).join(" ");
                let name = args[1];
                let desc = `Command created by ${user}`;
                let usage = `${name}`;

                if (!existsSync("./src/commands/custom/")) fs.mkdir("./src/commands/custom/");
                let template = (await fs.readFile("./src/commands/commandTemplate.template")).toString();
                // TODO: Fix this shit
                template = template.replace("TEMPLATENAME", name).replace("TEMPLATENAME", name).replace("TEMPLATENAME", name).replace("TEMPLATEDESC", desc).replace("TEMPLATEUSAGE", usage).replace("TEMPLATEMESSAGE", message);
                await fs.writeFile(`./src/commands/custom/${name}.ts`, template);
                await createCommand("../commands/custom/**/*");
                await chat.say(channel, `@${user} Successfully created command '${name}'!`);
                break;
            case "delete":
                if (!(await getCommands()).has(args[1])) { await chat.say(channel, `@${user} Command doesn't exist!`); return; }
                await deleteCommand("./src/commands/custom", args[1])
                await chat.say(channel, `@${user} Successfully removed command '${args[1]}'!`);
                break;
            default:
                await chat.say(channel, `@${user} Invalid Argument '${args[0]}'. Usage: ${this.usage}`);
                break;
        }
    }
}
export const cmd = new cmdCommand();