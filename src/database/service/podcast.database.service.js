const { configuration } = require('../database');
const { primary } = require('./connection.database.service');

async function findPodcastByTitle(title) {
	
    return await primary(configuration.primaryPodcastCollection).findOne({"source.title": title});

}

async function findPodcastByDoi(doi) {
	
    return await primary(configuration.primaryPodcastCollection).findOne({"source.doi": doi});

}

async function findPodcastBySubcategory(category) {
	
    return await primary(configuration.primaryPodcastCollection).find({"content.category": category}).toArray();

}

async function findLimitedNumberOfNewestPodcasts(number) {
	
    return await primary(configuration.primaryPodcastCollection).find({}).limit(parseInt(number)).toArray();

}

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

module.exports = { findPodcastByTitle, findPodcastByDoi, findPodcastBySubcategory, findLimitedNumberOfNewestPodcasts, insertPodcast }