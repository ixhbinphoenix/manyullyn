const { execute } = require("./hello");
const argHandler = require('../utils/args');

module.exports = {
    name: "roll",
    async execute(channel, tags, message, client) {
        const args = await argHandler.getArgsOfMessage(message);
        const max = Number(args[0]) || 100;
        await client.say(channel, `@${tags.username} you rolled ${Math.floor(Math.random() * (max + 1))}`);
    }
}