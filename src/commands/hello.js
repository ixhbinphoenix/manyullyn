

module.exports = {
    name: "hello",
    async execute(channel, tags, message, client) {
        client.say(channel,`Hello ${tags.username}!`);
    }
}