import { BaseCommand } from "../class";
import { isBroadcaster, isMod } from "../../utils/perms";
import { chatClient, refreshCommands } from "../../index";

class reloadCommand extends BaseCommand {
    name = "reload";
    description = "Reloads all commands";
    usage = "reload";
    execute = async (user: string, channel: string, args: Array<string>) => {
        if (!(isMod(user, channel) || isBroadcaster(user, channel))) return;
        refreshCommands();
        chatClient.say(channel, `@${user} Successfully reloaded commands!`);
    }
}
export const cmd = new reloadCommand();