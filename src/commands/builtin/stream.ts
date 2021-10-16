import { BaseCommand } from "../../lib/commands";
import chat from "../../lib/chat";
import { isBroadcaster, isMod, isVIP } from "../../lib/perms";
import { getStream, setStream, StreamData } from "../../utils/config";

const chatClient = chat.chatClient;

class streamCommand extends BaseCommand {
    name = "stream";
    description = "Shows when the next stream is";
    usage = "stream [<title | day | time | reset>] [<value>]";
    execute = async (user: string, channel: string, args: Array<string>) => {
        let data = getStream();
        if (!args[0]) {
            await chatClient.say(channel, `The next stream will be ${data.title} on ${data.date} at ${data.time}`);
        } else {
            if (!(isVIP(user, channel) || isMod(user, channel) || isBroadcaster(user, channel))) return await chatClient.say(channel, `The next stream will be ${data.title} on ${data.date} at ${data.time}`);
            let restargs: string[];
            switch (args[0]) {
                case "title":
                    if (!args[1]) return await chatClient.say(channel, `@${user} Not enough arguments! Usage: ${this.usage}`);
                    restargs = args.slice(1);
                    data.title = restargs.join(" ");
                    setStream(data);
                    await chatClient.say(channel, `@${user} Successfully changed stream title to '${restargs.join(" ")}'!`);
                    break;
                case "day":
                    if (!args[1]) return await chatClient.say(channel, `@${user} Not enough arguments! Usage: ${this.usage}`);
                    restargs = args.slice(1);
                    data.date = restargs.join(" ");
                    setStream(data);
                    await chatClient.say(channel, `@${user} Successfully changed stream day to '${restargs.join(" ")}'!`);
                    break;
                case "time":
                    if (!args[1]) return await chatClient.say(channel, `@${user} Not enough arguments! Usage: ${this.usage}`);
                    restargs = args.slice(1);
                    data.time = restargs.join(" ");
                    setStream(data);
                    await chatClient.say(channel, `@${user} Successfully changed stream time to '${restargs.join(" ")}'!`);
                    break;
                case "reset":
                    let ndata: StreamData = {
                        title: "TITLE_NOT_DEFINED",
                        time: "TIME_NOT_DEFINED",
                        date: "DAY_NOT_DEFINED"
                    }
                    setStream(ndata);
                    await chatClient.say(channel, `@${user} Successfully reset stream command!`);
                    break;
            }
        }
    }
}
export const cmd = new streamCommand();