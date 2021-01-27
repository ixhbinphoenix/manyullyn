const argHandler = require('../utils/args');
const roleHandler = require('../utils/roles');
const fs = require('fs');
const index = require('../index.js');


module.exports = {
    name: "cmd",
    async execute(channel, user, message, client) {
        const args = await argHandler.getArgsOfMessage(message);
        if (!await roleHandler.isModOrUp(user.badges || {})) return;
        if (args[0] == "delete") {
            if (!fs.existsSync(`./src/commands/${args[1]}.js`)) {
                return await client.say(channel,"Command does not exist!");
            } else {
                fs.rmSync(`./src/commands/${args[1]}.js`);
                await index.reloadCommands();
                return await client.say(channel,`Command deleted!`);
            }
        } else {
            if (fs.existsSync(`./src/commands/${args[0]}.js`)) {
                let name = args[0];
                args.shift();
                let cmdmsg = "";
                args.forEach(element => {
                    cmdmsg = cmdmsg + " " + element;
                });
                fs.truncateSync(`./src/commands/${name}.js`, 0);
                fs.writeFileSync(`./src/commands/${name}.js`, `const config = require('../config.js');\n\nmodule.exports = {\n    name: "${name}",\n   async execute(channel, tags, message, client) {\n   return await client.say(channel, "${cmdmsg}");\n}\n}`);
                await index.reloadCommands();
                return await client.say(channel, `Successfully changed command "${name}"!`);
            } else {
                let name = args[0];
                args.shift();
                let cmdmsg = "";
                args.forEach(element => {
                    cmdmsg += " " + element;
                });
                fs.writeFileSync(`./src/commands/${name}.js`, `const config = require('../config.js');\n\nmodule.exports = {\n    name: "${name}",\n   async execute(channel, tags, message, client) {\n   return await client.say(channel, "${cmdmsg}");\n}\n}`);
                await index.reloadCommands();
                return await client.say(channel, `Successfully created new command "${name}"!`);
            }
        }
    }
}