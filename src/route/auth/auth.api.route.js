const router = require('express').Router();
const { findUserByUsername, insertPrimaryUser, insertStageUser } = require('../../database/service/user.database.service')
const { toHash } = require('../../utility/auth.utility')

router.post('/api/auth/register', (request, response) => {
	// Check if user exists in the database
	const userExists = await findUserByUsername(request.body.profile.username);

	// If user does not exist, continue
	if (userExists == null) {
		console.log('The user does not exist')

		// Hash password 
		let hashedPassword = toHash(request.body.account.password)
		console.log('Hashed Password: ' + hashedPassword)

		// Build staged user document
		let user = {
			account: {
				email: request.body.account.email,
				password: hashedPassword,
				registerDate: new Date(),
				status: 'invalidated'
			},
			profile: {
				avatar: request.body.profile.avatar,
				name: {
					first: request.body.profile.name.first,
					last: request.body.profile.name.last
				},
				username: request.body.profile.username
			},
			curation: {
				category: [],
				creator: [],
				keyword: [],
				podcast: []
			}
		}

		// Insert user to database


		// Build staged creator document if user is 
		if (request.body.accreditation.orcid != null) {
			let creator = {
				// TO DO:
			}
		}

		 
		// TO DO:
	} else {
		// If user exists, then send response 	
		response.status(406).json({ message: 'User already exists.' })
	}
});

router.post('/api/auth/authenticate', (request, response) => {
	// TODO: response: validate authentication token, insert permanent document
});

router.delete('/api/auth/authenticate', (request, response) => {
	// TODO: response: delete temporary user (and creator) document
});

router.post('/api/auth/login', (request, response) => {
	// TODO: response: validate user credentials and store authentication token
});

router.get('/api/auth/recover', (request, response) => {
	// TODO: response: send email containing generated account recovery authentication token
});

router.patch('/api/auth/recover', (request, response) => {
	// TODO: response: validate account recovery authentication token, update password
});

module.exports = router;