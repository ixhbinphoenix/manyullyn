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
export function getTokens(): TokenConfig {
    return JSON.parse(fs.readFileSync("./src/tokens.json").toString());
}