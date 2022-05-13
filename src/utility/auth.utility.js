require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const { MongoGridFSChunkError } = require('mongodb');

function toHash(password) {
    const salt = process.env.SALT;
    const hashedPassword = bcrypt.hashSync(password, salt).replace(`${salt}.`, '')

    return hashedPassword;
}

module.exports = {toHash}