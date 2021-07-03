
import { BaseCommand } from "../class";
import { chatClient, refreshCommands } from "../../index";
import { isBroadcaster, isMod } from "../../utils/perms";
import { getCommands } from "../class";
import * as fs from "fs-extra";
import { build } from "tsc-prog";

class cmdCommand extends BaseCommand {
    name = "cmd";
    description = "Create, edit and delete custom commands";
    usage = "cmd <create | edit | delete> <name> [<command text>]";
    execute = async (user: string, channel: string, args: Array<string>) => {
        if (!(await isMod(user, channel) || await isBroadcaster(user, channel))) return;
        if (!args[1]) { await chatClient.say(channel, `@${user} Not enough arguments. Usage: ${this.usage}`); return; }
        // Checks if command name contains ~, /, \, ., ' or "
        let regex = new RegExp("[\'\"\~\/\\\.]", "g");
        if (regex.test(args[1])) { await chatClient.say(channel, `@${user} Command name contains invalid Characters!`); return; }
        switch (args[0]) {
            case "create":
                if (!args[2]) { await chatClient.say(channel, `@${user} Not enough arguments. Usage: ${this.usage}`); return; }
                if ((await getCommands()).has(args[1])) { await chatClient.say(channel, `@${user} Command already exists!`); return;}

                let name = args[1];
                let desc = `Command created by ${user}`;
                let usage = `${name}`;
                let message = args[2];

                if (!fs.existsSync("./src/commands/custom/")) fs.mkdirSync("./src/commands/custom/");
                let template = fs.readFileSync("./src/commands/commandTemplate.template").toString();
                // TODO: Fix this shit
                template = template.replace("TEMPLATENAME", name).replace("TEMPLATENAME", name).replace("TEMPLATENAME", name).replace("TEMPLATEDESC", desc).replace("TEMPLATEUSAGE", usage).replace("TEMPLATEMESSAGE", message);
                fs.writeFileSync(`./src/commands/custom/${name}.ts`, template);
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
                    include: ['../custom/**/*']
                })
                await refreshCommands();
                await chatClient.say(channel, `@${user} Successfully created command '${name}'!`);
                break;
            case "edit":
                if (!args[2]) { await chatClient.say(channel, `@${user} Not enough arguments. Usage: ${this.usage}`); return; }
                if (!(await getCommands()).has(args[1])) { await chatClient.say(channel, `@${user} Command doesn't exist! Try creating it by using 'cmd create ${args[1]} ${args[2]}'`); return; }
                let ename = args[1];
                let edesc = `Command created by ${user}`;
                let eusage = `${ename}`;
                let emessage = args[2];
                fs.rmSync("./src/commands/custom/" + ename + ".ts");
                fs.rmSync("./src/commands/custom/" + ename + ".js");
                let etemplate = fs.readFileSync("./src/commands/commandTemplate.template").toString();
                etemplate = etemplate.replace("TEMPLATENAME", ename).replace("TEMPLATEDESC", edesc).replace("TEMPLATEUSAGE", eusage).replace("TEMPLATEMESSAGE", emessage);
                fs.writeFileSync(`./src/commands/custom/${ename}.ts`, etemplate);
                build({
                    basePath: __dirname + '../custom/',
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
                    include: ['/*']
                })
                await refreshCommands();
                await chatClient.say(channel, `@${user} Successfully edited command '${ename}'!`);
                break;
            case "delete":
                if (!(await getCommands()).has(args[1])) { await chatClient.say(channel, `@${user} Command doesn't exist!`); return; }
                fs.rmSync("./src/commands/custom/" + args[1] + ".ts");
                fs.rmSync("./src/commands/custom/" + args[1] + ".js");
                await refreshCommands();
                await chatClient.say(channel, `@${user} Successfully removed command '${args[1]}'!`);
                break;
            default:
                await chatClient.say(channel, `@${user} Invalid Argument '${args[0]}'. Usage: ${this.usage}`);
                break;
        }
    }
}
export const cmd = new cmdCommand();