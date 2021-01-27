

module.exports = {
    async isModOrUp(badges) {
        const isModOrUp = badges.hasOwnProperty('moderator') || badges.hasOwnProperty('broadcaster');
        return isModOrUp;
    }
}