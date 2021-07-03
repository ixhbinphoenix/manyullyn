import { BaseCommand } from "../class";
import { chatClient } from "../../index";

class PingCommand extends BaseCommand {
    name = "ping";
    description = "Test message to see if the bot runs properly";
    usage = "ping ";
    execute = async (user: string, channel: string, args: Array<string>) => {
        chatClient.say(channel, `Pong! @${user}`);
    }
}
export const cmd = new PingCommand();