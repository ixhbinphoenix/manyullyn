

module.exports = {
    async getArgsOfMessage(message) {
        const args = message
        .slice(1)
        .trim()
        .split(" ");
        args.shift();
        return args;
    }
}