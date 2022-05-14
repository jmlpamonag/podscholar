const router = require('express').Router();
const { render } = require('../../utility/mustache.utility');
const { createFeed } = require('../../service/content/feed.service');

router.get('/', (request, response) => {
	response.status(200).send(render('src/route/site/view/index.html', {
		userProfileContent: response.locals.userProfileContent,
		recentFeed: createFeed('recent', null, 'A glance at the most recent content published to PodScholar.')
	}));
});

router.get('/faq', (request, response) => {
	response.status(200).send(render('src/route/site/view/faq.html', {
		userProfileContent: response.locals.userProfileContent
	}));
});

router.get('/about', (request, response) => {
	response.status(200).send(render('src/route/site/view/about.html', {
		userProfileContent: response.locals.userProfileContent
	}));
});

router.get('/contact', (request, response) => {
	response.status(200).send(render('src/route/site/view/contact.html', {
		userProfileContent: response.locals.userProfileContent
	}));
});

module.exports = router;