import * as fs from 'fs';

interface botConfig {
    app: {
        clientId: string;
        clientSecret: string;
    };
    tmi: {
        channels: Array<string>;
    };
    prefix: string;
}
interface TokenConfig {
    accessToken: string;
    refreshToken: string,
    expiresIn: number,
    obtainmentTimestamp: number
}

export function getConfig(): botConfig {
        return JSON.parse(fs.readFileSync("./src/config.json").toString());
}
export function getAPITokens(): TokenConfig {
    return JSON.parse(fs.readFileSync("./src/APItokens.json").toString());
}
export function getTMITokens(): TokenConfig {
    return JSON.parse(fs.readFileSync("./src/TMItokens.json").toString());
}