import { ChatSayMessageAttributes } from "@twurple/chat/lib";
import { chatClient } from "..";

class chat {
    log = new Array<string>()
    chatClient = chatClient
    say = async (channel: string, message: string, attributes?: ChatSayMessageAttributes | undefined) => {
        if (process.env.test == "TRUE") {
            console.log(`chat:say:${channel} :: ${message}`)
            this.log.push(`chat:say:${channel} :: ${message}`)
        } else {
            if (process.env.logLevel == "DEBUG") { console.log(`chat:say:${channel} :: ${message}`) }
            chatClient.say(channel, message, attributes)
        }
    }
}

export default new chat()