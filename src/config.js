const fs = require('fs');

module.exports = {
    loadSecrets() {
        return JSON.parse(fs.readFileSync("./config/secrets.json"));
    },
    loadConfig() {
        return JSON.parse(fs.readFileSync("./config/config.json"));
    }
}

