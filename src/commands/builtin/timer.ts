import { BaseCommand } from "../class";
import { chatClient, timers } from "../../index";
import { isBroadcaster, isMod } from "../../utils/perms";
import ms from "ms";

export interface TimerInterval {
    time: number,
    interval: NodeJS.Timeout
}

class timerCommand extends BaseCommand {
    name = "timer";
    description = "Set an interval for a message to be send";
    usage = "timer [<create | pause> <name>] [<time> <message>]";
    execute = async (user: string, channel: string, args: Array<string>) => {
        if (!(isMod(user, channel) || isBroadcaster(user, channel))) return;
        if (!args[0]) {
            let msgq: string[] = [];
            msgq[0] = `@${user} List of all current timers:`;
            timers.forEach((val, k) => {
                msgq[msgq.length] = `${k}: ${ms(val.time)}`;
            })
            msgq.forEach(async (val) => {
                await chatClient.say(channel, val);
            })
        } else {
            switch (args[0]) {
                case "create":
                    if (!args[3]) return await chatClient.say(channel, `@${user} Not enough arguments! Usage: ${this.usage}`);
                    if (!Number(ms(args[2]))) return await chatClient.say(channel, `@${user} Invalid time format!`);
                    if (timers.has(args[1])) return await chatClient.say(channel, `@${user} Timer ${args[1]} already exists!`);
                    let restargs = args.slice(3).join(" ");
                    let data: TimerInterval = {
                        time: ms(args[2]),
                        interval: setInterval(() => {
                            chatClient.say(channel, restargs);
                        }, ms(args[2]))
                    }
                    timers.set(args[1], data);
                    await chatClient.say(channel, `@${user} Timer '${args[1]}' created!`);
                    break;
                case "pause":
                    if (!args[1]) return await chatClient.say(channel, `@${user} Not enough arguments! Usage: ${this.usage}`);
                    if (!timers.has(args[1])) return await chatClient.say(channel, `@${user} Timer '${args[1]}' does not exist!`);
                    clearInterval(timers.get(args[1])?.interval as NodeJS.Timeout);
                    timers.delete(args[1]);
                    await chatClient.say(channel, `@${user} Timer '${args[1]}' deleted!`);
                    break;
            }
        }
    }
}
export const cmd = new timerCommand();