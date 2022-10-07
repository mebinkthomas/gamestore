const crypto = require('crypto');

const key = crypto.randomBytes(36).toString('hex');

console.log({key});