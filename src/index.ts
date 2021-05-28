import { RefreshingAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { ChatClient } from '@twurple/chat';
import { getConfig, getTokens } from './utils/config';
import { TwitchPrivateMessage } from '@twurple/chat/lib/StandardCommands/TwitchPrivateMessage';
import { promises as fs } from 'fs';
import { getCommands } from './commands/class';

const config = getConfig();
const tokens = getTokens();
const AuthProvider = new RefreshingAuthProvider(
    {
        clientId: config.app.clientId,
        clientSecret: config.app.clientSecret,
        onRefresh: async newToken => await fs.writeFile("./src/tokens.json", JSON.stringify(newToken, null, 4), "utf-8")
    },
    tokens
)

//export const api = new ApiClient({ authProvider: AuthProvider });
export const chatClient = new ChatClient(
    AuthProvider,
    { channels: config.tmi.channels }
)
const commands = getCommands();

async function main() {
    chatClient.onMessage(async (channel: string, user: string, message: string, msg: TwitchPrivateMessage) => {
        if (message.startsWith(config.prefix)) {
            let cmdmsg = message.substring(config.prefix.length).split(" ");
            const cmd = cmdmsg[0];
            const args = cmdmsg.slice(1);
            console.log(cmd);
            if ((await commands).get(cmd)) {
                const command = (await commands).get(cmd);
                await command.execute(user, channel, args, msg);
            }
        }
    })
    

    await chatClient.connect();
    console.log("ChatClient connected");
}
main();