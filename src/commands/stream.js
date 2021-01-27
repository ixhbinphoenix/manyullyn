const config = require('../config');
const argHandler = require('../utils/args');
const roleHandler = require('../utils/roles');
const fs = require('fs');

module.exports = {
    name: "stream",
    async execute(channel, tags, message, client) {
        const args = await argHandler.getArgsOfMessage(message);
        if (!args[0]) {
            return await client.say(channel, `The next stream will be ${config.loadConfig().stream.title} on the ${config.loadConfig().stream.day} at ${config.loadConfig().stream.time}`);
        } else {
            if (!await roleHandler.isModOrUp(tags.badges || {})) return;
            let cmdmsg = "";
            let data;
            switch (args[0]) {
                case "title":
                    args.shift();
                    args.forEach(element => {
                        cmdmsg = cmdmsg + " " + element;
                    });
                    data = await config.loadConfig();
                    data.stream.title = cmdmsg;
                    fs.truncateSync('./config/config.json');
                    fs.writeFileSync('./config/config.json', JSON.stringify(data));
                    await client.say(channel,`Changed title to ${cmdmsg}`);
                    break;
                case "day":
                    args.shift();
                    args.forEach(element => {
                        cmdmsg = cmdmsg + " " + element;
                    });
                    data = await config.loadConfig();
                    data.stream.day = cmdmsg;
                    fs.truncateSync('./config/config.json');
                    fs.writeFileSync('./config/config.json', JSON.stringify(data));
                    await client.say(channel,`Changed day to ${cmdmsg}`);
                    break;
                case "time":
                    args.shift();
                    args.forEach(element => {
                        cmdmsg = cmdmsg + " " + element;
                    });
                    data = config.loadConfig();
                    data.stream.time = cmdmsg;
                    fs.truncateSync('./config/config.json');
                    fs.writeFileSync('./config/config.json', JSON.stringify(data));
                    await client.say(channel,`Changed time to ${cmdmsg}`);
                    break;
                case "reset":
                    data = config.loadConfig();
                    data.stream.title = "TITLE_NOT_DEFINED";
                    data.stream.day = "DAY_NOT_DEFINED";
                    data.stream.time = "TIME_NOT_DEFINED";
                    fs.truncateSync('./config/config.json');
                    fs.writeFileSync('./config/config.json', JSON.stringify(data));
                    await client.say(channel,`Reset stream message!`);
                    break;
                    
            }
        }

        
    }
}