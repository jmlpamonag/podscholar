const { configuration } = require('../database');
const { primary, stage } = require('./connection.database.service');
const { ObjectId } = require("mongodb");

async function findPrimaryCreator(id) {
	return await primary(configuration.primaryCreatorCollection).findOne({ _id: new ObjectId(id) });
}

async function findStageCreator(id) {
	return await stage(configuration.stageCreatorCollection).findOne({ _id: new ObjectId(id) });
}

async function insertPrimaryCreator(creator) {
	const result = await primary(configuration.primaryCreatorCollection).insertOne(creator);

	if (result !== null) {
		console.log(`A creator document was inserted in the primary database with the _id: ${result.insertedId}`);

		return result.insertedId;

	} else {
		console.log('A primary creator document insertion request has failed.');

		return null;
	}
}

async function insertStageCreator(creator) {
	const result = await stage(configuration.stageCreatorCollection).insertOne(creator);

	if (result !== null) {
		console.log(`A creator document was inserted in the stage database with the _id: ${result.insertedId}`);

		return result.insertedId;

	} else {
		console.log('A stage creator document insertion request has failed.');

		return null;
	}
}

module.exports = { findPrimaryCreator, findStageCreator, insertPrimaryCreator, insertStageCreator }