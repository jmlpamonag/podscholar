const { configuration, get } = require('../database');

function primary(collection) {
	return get().db(configuration.primaryDatabase).collection(collection);
}

function stage(collection) {
	return get().db(configuration.stageDatabase).collection(collection);
}

function authentication(collection) {
	return get().db(configuration.authenticationDatabase).collection(collection);
}

module.exports = { primary, stage, authentication}