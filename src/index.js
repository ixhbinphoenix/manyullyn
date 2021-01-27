const tmi = require('tmi.js');
const fs = require('fs');
const config = require('./config.js');

let commandFiles = fs.readdirSync('./src/commands').filter((file) => file.endsWith('.js'));

let commands = new Map();

for (const file of commandFiles) {
    let command = require(`./commands/${file}`);
    commands.set(command.name, command);
}

const client = new tmi.client({
    options: {debug: true, messagesLogLevel: "info"},
    connection: {
        reconnect: true,
        secure: true,
    },
    identity: config.loadSecrets().identity,
    channels: config.loadConfig().channels
})

client.connect().catch(console.error);
client.on('chat', async (channel, user, message, self) => {
    if (self) return;
    if (!message.startsWith("!")) return;

    let commandName = message.slice(1).trim().split(" ")[0].toLowerCase();

    if (!commands.has(commandName)) return console.debug("Command not found!");

    const command = await commands.get(commandName);

    try {
        await command.execute(channel, user, message, client);
    } catch (e) {
        console.error(e);
    }
})

module.exports.reloadCommands =  async function reloadCommands() {
    commandFiles = fs.readdirSync('./src/commands').filter((file) => file.endsWith('.js'));

    commands = new Map();

    for (const file of commandFiles) {
        command = require(`./commands/${file}`);
        commands.set(command.name, command);
    }
}