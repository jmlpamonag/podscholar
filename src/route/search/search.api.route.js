const router = require('express').Router();
const { findCategory } = require('../../database/service/category.database.service');
const { findSubcategory } = require('../../database/service/category.database.service');
const { findUserByUsername } = require('../../database/service/user.database.service');
const { findPodcastByTitle } = require('../../database/service/podcast.database.service.js');
const { findPodcastByDoi } = require('../../database/service/podcast.database.service.js');
const { findPodcastBySubcategory } = require('../../database/service/podcast.database.service.js');
const { findLimitedNumberOfNewestPodcasts } = require('../../database/service/podcast.database.service.js');

// Use configured number in .env, everything else
router.get('/api/search/recent', (request, response) => {
	
    return response.redirect(`/api/search/recent/${process.env.DEFAULT_FEED_CONTENT_COUNT}`);
    // TODO: Change the src/configuration/feed.configuration.js once more time

});

router.get('/api/search/recent/:count', async (request, response) => {
    
    const newestPodcasts = await findLimitedNumberOfNewestPodcasts(request.params.count);

    return response.status(200).json(  );

});

router.get('/api/search/:value', async (request, response) => {
	
    // Variable declarations
    const doiRegularExpression = /\b(10[.][0-9]{4,}(?:[.][0-9]+)*(?:(?!["&\'<>])\S)+)\b/i; // Source of this regex: https://stackoverflow.com/questions/27910/finding-a-doi-in-a-document-or-page
    const emailRegularExpression = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/; // Source of this regex: https://emailregex.com/
    let tokenizedInput = request.params.value.trim().split(" "); // Tokenize the input based on meaningful spaces

    for(let i = 0; i < tokenizedInput.length; i++) {
        tokenizedInput[i] = tokenizedInput[i].toLowerCase(); // Make each element formatted properly with a starting capital letter and the rest in lowecase
    }

    let formattedTokenizedString = ""; // Formatted non-tokenized string for querying against the database in multiword queries

    // Format the tokenized inputs
    for(let i = 0; i < tokenizedInput.length; i++) formattedTokenizedString += tokenizedInput[i] + " ";

    formattedTokenizedString = formattedTokenizedString.trim();

    // All of this prioritization requires 2 or less inputs so if the input is greater than 3 then it must be a general search
    if(tokenizedInput.length <= 2) {

        // 1. Is this a category
        // If the category exists in the DB then send them to the category webpage with the anchor on it

        const category = await findCategory(formattedTokenizedString);

        if( category ) {

            // We may want to add ID tags to the headings in this section so we can redirect to an anchor on the page
            let anchorHTMLRedirect = "";

            anchorHTMLRedirect = tokenizedInput.join('-');
            anchorHTMLRedirect = anchorHTMLRedirect.toLowerCase(); // Expecintg an output like 'computer-science'

            return response.redirect(`/browse/category#${anchorHTMLRedirect}`);

        }

        // Check to see if the subacategory exists in the DB. If so route the user to a general search
        const subcategory = await findSubcategory(formattedTokenizedString);
        
        if ( subcategory ) {

            let apiRedirectString = tokenizedInput.join(' '); // This might need to be '%20', figure out through testing

            console.log("This isn't running right?")
            console.log(apiRedirectString);

            return response.redirect(`/api/search/subcategory/${apiRedirectString}`);

        }


        // TODO: Problematic to implement due to the '/' in the DOIs. Ex: 10.1007/978-3-030-80744-3_77, fix this later
        // // 2. Is it a DOI?
        // if( doiRegularExpression.test(request.params.value) ) {

        //     return response.redirect(`/api/search/doi/${request.params.value}`);

        // }

        // 3. Is this a username?
        const username = await findUserByUsername(tokenizedInput[0].toLowerCase());

        if( username ) {

            return response.redirect(`/user/${username}`);

        }

    }
    
    return response.redirect(`/api/search/general/${request.params.value}`);
    

});

router.get('/api/search/subcategory/:value', async (request, response) => {

    const podcasts = await findPodcastBySubcategory( request.params.value );
    return response.status(200).json( podcasts );    

});

router.get('/api/search/doi/:value', async (request, response) => {

    const podcast = await findPodcastByDoi( request.params.value );
    const username = podcast.content.creator;
    const podcastName = podcast.source.title;

    console.log(`Your username is: ${username}\nYour podcast name is: ${podcastName}`);

});

router.get('/api/search/user/:value', async (request, response) => {

    // Redirect to the user profile
    response.redirect(`/user/${request.params.value}`);

});

router.get('/api/search/general/:value', async (request, response) => {

    const value = request.params.value;
    const searchCaseInsensitively = new RegExp('^' + value + '$', 'i');
    const allPodcastsWithMatchingTitle = await findPodcastByTitle(searchCaseInsensitively);

    // Return a JSON of all podcasts that match a title case insensitively
    return response.status(200).json( allPodcastsWithMatchingTitle );

});

router.get('/api/search/general/:value/:count', (request, response) => {

    // Not currently used but in the future return only a certain number of podcasts

});

// router.get('/api/search/:value/:count', (request, response) => {
// 	// TODO: generic length-limited search endpoint, reroute to length-limited targeted search api call
// });

// router.get('/api/search/:type/:value', (request, response) => {
// 	// TODO: response: configurable number of podcasts matching arguments :type and :value
// });

// router.get('/api/search/:type/:value/:count', (request, response) => {
// 	// TODO: response: :count podcasts matching arguments :type and :value
// });

// router.get('/api/search/:primaryType/:primaryValue/:secondaryType/:secondaryValue', (request, response) => {
// 	// TODO: response: configurable number of podcasts matching arguments :primaryType and :primaryValue and
// 	//  :secondaryType and :secondaryValue
// });

// router.get('/api/search/:primaryType/:primaryValue/:secondaryType/:secondaryValue/:count', (request, response) => {
// 	// TODO: response: :count podcasts matching arguments :primaryType and :primaryValue and :secondaryType and
// 	//  :secondaryValue
// });

// router.get('/api/search/:primaryType/:primaryValue/:secondaryType/:secondaryValue/:tertiaryType/:tertiaryValue', (request, response) => {
// 	// TODO: response: configurable number of podcasts matching arguments :primaryType and :primaryValue, :secondaryType
// 	//  and :secondaryValue, and :tertiaryType and :tertiaryValue
// });

// router.get('/api/search/:primaryType/:primaryValue/:secondaryType/:secondaryValue/:tertiaryType/:tertiaryValue/:count', (request, response) => {
// 	// TODO: response: :count podcasts matching arguments :primaryType and :primaryValue, :secondaryType and
// 	//  :secondaryValue, and :tertiaryType and :tertiaryValue
// });

module.exports = router;