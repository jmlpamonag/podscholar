const Mustache = require('mustache');
const { readFileSync } = require('fs');

function render(template, view) {
	return Mustache.render(readFileSync(template, 'utf8'), view);
}

module.exports = { render };