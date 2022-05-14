require('dotenv').config();
const { configuration } = require('../database');
const { authentication } = require('./connection.database.service');
const { ObjectId } = require('mongodb');

async function insertToken(token) {
        const result = await authentication(configuration.authenticationTokenCollection).insertOne(token)
        
        if (result !== null) {
            console.log(`A token document was inserted with the _id: ${result.insertedId}`);
    
            return result.insertedId;
    
        } else {
            console.log('A token document insertion request failed!');
    
            return null;
        }
}

async function insertValidationToken(token) {
    const result = await authentication(configuration.authenticationValidationCollection).insertOne(token)
        
    if (result !== null) {
        console.log(`A validation token document was inserted with the _id: ${result.insertedId}`);

        return result.insertedId;

    } else {
        console.log('A document insertion request failed!');

        return null;
    }
}

async function deleteValidationToken(token) {
    const result = await authentication(configuration.authenticationValidationCollection).deleteOne(token)

    if (result !== null) {
        console.log(`A validation token document was deleted with the _id: ${result.insertedId}`);

        return result.insertedId;

    } else {
        console.log('A document deletion request failed!');

        return null;
    }
}

async function findValidationTokenByToken(token) {
    return await authentication(configuration.authenticationValidationCollection).findOne(token)
}

async function findAccessTokenByToken(token) {
    return await authentication(configuration.authenticationTokenCollection).findOne(token)
}

const authenticate = (request, response, next) => {
    const token = request.cookies.access_token;

    if(!token) {
        return response.status(403).json({ message: 'Something went wrong'})
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return response.status(403).json({ message: 'Something went wrong'})
        response.locals.userId = user.userId
        response.locals.authenticated = true

        next()
      })
}

module.exports = {insertToken, insertValidationToken, deleteValidationToken, findValidationTokenByToken, findAccessTokenByToken, authenticate};