require('dotenv').config();
const { configuration } = require('../database');
const { authentication } = require('./connection.database.service');
const { ObjectId } = require('mongodb');

async function insertToken(token) {
        const result = await authentication(configuration.authenticationTokenCollection).insertOne(token)
        
        if (result !== null) {
            console.log(`A user document was inserted with the _id: ${result.insertedId}`);
    
            return result.insertedId;
    
        } else {
            console.log('A document insertion request failed!');
    
            return null;
        }
}

async function insertValidationToken(token) {
    const result = await authentication(configuration.authenticationValidationCollection).insertOne(token)
        
    if (result !== null) {
        console.log(`A valid user document was inserted with the _id: ${result.insertedId}`);

        return result.insertedId;

    } else {
        console.log('A document insertion request failed!');

        return null;
    }
}

module.exports = {insertToken, insertValidationToken};