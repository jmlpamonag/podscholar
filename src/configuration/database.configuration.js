const databaseConfiguration = {
	connectionString: process.env.DATABASE_CONNECTION_STRING,

	authenticationDatabase: 'authentication',
	authenticationTokenCollection: 'token',
	authenticationValidationCollection: 'validationToken',

	primaryDatabase: 'primary',
	primaryCategoryCollection: 'category',
	primaryCreatorCollection: 'creator',
	primaryPodcastCollection: 'podcast',
	primaryUserCollection: 'user',

	stageDatabase: 'stage',
	stageCreatorCollection: 'creator',
	stageUserCollection: 'user',
}

module.exports = databaseConfiguration;