require('dotenv').config();

const express = require('express');

const configuration = require('./configuration/application.configuration');
const database = require('./database/database');
const router = require('./route/index.route');
const cookieParser = require('cookie-parser')

const app = express();

app.use(express.json())

app.use(router);
app.use(cookieParser());

app.listen(configuration.port, async () => {
	console.log(`PodScholar listening on port ${configuration.port}.`);

	database.connect();
});