import { RefreshingAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { ChatClient } from '@twurple/chat';
import { getConfig, getAPITokens, getTMITokens } from './utils/config';
import { promises as fs } from 'fs';
import { getCommands } from './commands/class';

const config = getConfig();
const APItokens = getAPITokens();
const TMItokens = getTMITokens();
// Auth for using the Helix API
const ApiAuth = new RefreshingAuthProvider(
    {
        clientId: config.app.clientId,
        clientSecret: config.app.clientSecret,
        onRefresh: async newToken => await fs.writeFile("./src/APItokens.json", JSON.stringify(newToken, null, 4), "utf-8")
    },
    APItokens
)
// Auth for TMI with the manyullyn user
const tmiAuth = new RefreshingAuthProvider(
    {
        clientId: config.app.clientId,
        clientSecret: config.app.clientSecret,
        onRefresh: async newToken => await fs.writeFile("./src/TMItokens.json", JSON.stringify(newToken, null, 4), "utf-8")
    },
    TMItokens
)
export const api = new ApiClient({authProvider: ApiAuth})
export const chatClient = new ChatClient(
    tmiAuth,
    { channels: config.tmi.channels }
)
let commands = getCommands();

export async function refreshCommands(): Promise<void> {
    commands = getCommands();
}

async function main(): Promise<void> {
    chatClient.onMessage(async (channel: string, user: string, message: string) => {
        if (message.startsWith(config.prefix)) {
            let cmdmsg = message.substring(config.prefix.length).split(" ");
            const cmd = cmdmsg[0];
            const args = cmdmsg.slice(1);
            if ((await commands).get(cmd)) {
                const command = (await commands).get(cmd);
                await command.execute(user, channel, args);
            }
        }
    })
    

    await chatClient.connect();
    console.log("ChatClient connected");
}
main();