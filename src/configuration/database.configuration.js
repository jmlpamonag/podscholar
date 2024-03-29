const databaseConfiguration = {
	connectionString: process.env.DATABASE_CONNECTION_STRING,

	authenticationDatabase: 'authentication',
	authenticationTokenCollection: 'token',

	primaryDatabase: 'primary',
	primaryCategoryCollection: 'category',
	primaryCreatorCollection: 'creator',
	primaryKeywordCollection: 'keyword',
	primaryPodcastCollection: 'podcast',
	primaryUserCollection: 'user',

	stageDatabase: 'stage',
	stageCreatorCollection: 'creator',
	stageUserCollection: 'user',
}

module.exports = databaseConfiguration;