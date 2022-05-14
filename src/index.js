require('dotenv').config();

const express = require('express');

const configuration = require('./configuration/application.configuration');
const database = require('./database/database');
const router = require('./route/index.route');

const app = express();

app.use('/asset', express.static('asset'));
app.set('view engine', 'mustache');

app.use((request, response, next) => {
	response.locals.userProfileContent = (response.locals.authenticated === true) ?
		'<a class="nav-link" href="/register">Account</a>' :
		`<a class="nav-link" href="/register">Register<i class="bi bi-arrow-right ms-2"></i></a>`;

	next();
});

app.use(router);

app.listen(configuration.port, async () => {
	console.log(`PodScholar listening on port ${configuration.port}.`);

	database.connect();
});