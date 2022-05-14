const { configuration } = require('../database');
const { primary } = require('./connection.database.service');

async function findCategory(name) {
	return await primary(configuration.primaryCategoryCollection).findOne({name: name});
}

async function findSubcategory(name) {
	return await primary(configuration.primaryCategoryCollection).findOne({'children.name': name});
}

function insertCategory(document) {
	primary(configuration.primaryCategoryCollection).insertOne(document, (error) => {
		if (error) return console.log(error);
	});
}

function insertCategories(documents) {
	primary(configuration.primaryCategoryCollection).insertMany(documents, (error) => {
		if (error) return console.log(error);
	});
}

module.exports = { findCategory, findSubcategory, insertCategory, insertCategories };