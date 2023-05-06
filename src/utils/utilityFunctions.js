const crypto = require("crypto");

const generateRandomBytes = (bytes = 32) => {
    return crypto.randomBytes(bytes).toString('hex');
}

module.exports = {
    generateRandomBytes
}