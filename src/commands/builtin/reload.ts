import { BaseCommand } from "../../lib/commands";
import { isBroadcaster, isMod } from "../../lib/perms";
import chat from "../../lib/chat";
import { refreshCommands } from "../../lib/commands";


class reloadCommand extends BaseCommand {
    name = "reload";
    description = "Reloads all commands";
    usage = "reload";
    execute = async (user: string, channel: string, args: Array<string>) => {
        if (!(isMod(user, channel) || isBroadcaster(user, channel))) return;
        refreshCommands();
        chat.say(channel, `@${user} Successfully reloaded commands!`);
    }
}
export const cmd = new reloadCommand();