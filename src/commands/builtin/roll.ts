import { BaseCommand } from "../class";
import { chatClient } from "../../index";

class rollCommand extends BaseCommand {
    name = "roll";
    description = "Rolls a random number up to a given number (Default: 100)";
    usage = "roll [<max>]";
    execute = async (user: string, channel: string, args: Array<string>) => {
        if (Number(args[0])) {
            let max = Number(args[0]);
            let ran = Math.floor(Math.random() * (max - 0 + 1) + 0);
            await chatClient.say(channel, `@${user} rolled ${ran}!`);
        } else {
            let ran = Math.floor(Math.random() * (100 - 0 + 1) + 0);
            await chatClient.say(channel, `@${user} rolled ${ran}!`);
        }
    }
}
export const cmd = new rollCommand();