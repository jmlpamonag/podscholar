const { configuration } = require('../database');
const { primary, stage} = require('./connection.database.service');
const { ObjectId } = require('mongodb');

async function findUserById(id) {
	return await primary(configuration.primaryUserCollection).findOne({ _id: new ObjectId(id) });
}

async function findUserByUsername(username) {
	return await primary(configuration.primaryUserCollection).findOne({'profile.username': username });
}

async function insertPrimaryUser(user) {
	const result = await primary(configuration.primaryUserCollection).insertOne(user);

	if (result !== null) {
		console.log(`A user document was inserted in the primary database with the _id: ${result.insertedId}`);

		return result.insertedId;

	} else {
		console.log('A document insertion request to primary failed!');

		return null;
	}
}

async function insertStageUser(user) {
	const result = await stage(configuration.stageUserCollection).insertOne(user);

	if (result !== null) {
		console.log(`A user document was inserted in the stage database with the _id: ${result.insertedId}`);

		return result.insertedId;

	} else {
		console.log('A document insertion request to stage failed!');

		return null;
	}
}

module.exports = { findUserById, findUserByUsername, insertPrimaryUser, insertStageUser };