require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const { MongoGridFSChunkError } = require('mongodb');

function toHash(password) {
    const salt = process.env.SALT;
    const hashedPassword = bcrypt.hashSync(password, salt).replace(`${salt}.`, '')

    return hashedPassword;
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: parseInt(process.env.JWT_TIMEOUT) })
}

function generateValidationToken(user) {
    return jwt.sign(user, process.env.VALIDATON_TOKEN_SECRET, { expiresIn: parseInt(process.env.JWT_TIMEOUT) })
}

module.exports = {toHash, generateValidationToken, generateAccessToken}