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
export interface StreamData {
    title: string,
    date: string,
    time: string
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
export function getStream(): StreamData {
    return JSON.parse(fs.readFileSync("./src/commands/builtin/stream.json").toString());
} 
export function setStream(data: StreamData): void {
    fs.truncateSync("./src/commands/builtin/stream.json", 0);
    fs.writeFileSync("./src/commands/builtin/stream.json", JSON.stringify(data, undefined, 4));
}