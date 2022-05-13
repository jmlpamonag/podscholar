const { configuration } = require('../database');
const { primary } = require('./connection.database.service');

async function insertPodcast(podcast) {
	const result = await primary(configuration.primaryPodcastCollection).insertOne(podcast);

	if (result !== null) {
		console.log(`A podcast document was inserted in the primary database with the _id: ${result.insertedId}`);

		return result.insertedId;

	} else {
		console.log('A primary podcast document insertion request has failed.');

		return null;
	}
}

module.exports = { insertPodcast }