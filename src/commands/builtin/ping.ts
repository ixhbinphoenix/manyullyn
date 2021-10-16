import { BaseCommand } from "../../lib/commands";
import chat from "../../lib/chat";

class PingCommand extends BaseCommand {
    name = "ping";
    description = "Test message to see if the bot runs properly";
    usage = "ping ";
    execute = async (user: string, channel: string, args: Array<string>) => {
        chat.say(channel, `Pong! @${user}`);
    }
}
export const cmd = new PingCommand();