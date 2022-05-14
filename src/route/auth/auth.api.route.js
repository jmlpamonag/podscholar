require('dotenv').config();

const router = require('express').Router();
const { ObjectId } = require('mongodb');
const axios = require('axios');
const nodemailer = require('nodemailer')
const { insertPrimaryCreator, insertStageCreator, findStageCreator } = require('../../database/service/creator.database.service');
const { insertToken, insertValidationToken, deleteValidationToken, findValidationTokenByToken, findAccessTokenByToken } = require('../../database/service/token.database.service');
const { findUserByUsername, insertPrimaryUser, insertStageUser, deleteStageUser, findStageUserById, findPrimaryUserById, updatePrimaryUserStatus, deleteStageCreator, findUserByEmail, updatePassword } = require('../../database/service/user.database.service')
const { toHash, generateValidationToken, generateAccessToken } = require('../../utility/auth.utility')

router.post('/api/auth/register', async (request, response) => {
	// Check if user exists in the database
	console.log(request.body)
	const user = await findUserByUsername(request.body.profile.username);

	// If user does not exist, continue
	if (user == null) {
		console.log('The user does not exist')

		// Hash password 
		let hashedPassword = toHash(request.body.account.password)
		console.log('Hashed Password: ' + hashedPassword)

		// Build staged user document
		let newUser = {
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
				podcast: {
					bookmark: [],
					like: []
				}
			}
		}

		// Insert stage user to database
		const stageUser = await insertStageUser(newUser);

		// Check if the user wants to be a creator, and create creator document
		if (request.body.accreditation.orcid != null) {
			let creator = {
				accreditation: {
					orcid: request.body.accreditation.orcid
				},
				affiliation: {
					institution: request.body.affiliation.institution,
					position: request.body.affiliation.position
				},
				content: {
					creator: [],

					curation: {
						category: [],
						keyword: []
					}
				},

				metric: {
					creator: {
						follow: []
					},

					podcast: {
						bookmark: [],
						like: []
					}
				},
				profile: {
					about: request.body.profile.about
				},
				social: {
					github: request.body.social.github,
					googleScholar: request.body.social.googleScholar,
					linkedIn: request.body.social.linkedIn,
					twitter: request.body.social.twitter
				}
			}

			const stageCreator = await insertStageCreator(creator);
		}

		// Generate JWT token after succesfull insertion
		if (stageUser != null) {
			const accessToken = generateValidationToken({ id: stageUser })
			console.log('Token: ' + accessToken)

			const token = {
				token: accessToken,
				userId: stageUser
			}

			const validationToken = await insertValidationToken(token);
			if (validationToken != null) {
				// Send an email
				const message = 'Recovery Link: ' + validationToken;

				let transporter = nodemailer.createTransport({
					service: 'gmail',
					auth: {
						user: 'podscholar.app@gmail.com',
						pass: 'podscholarapp@2022'
					}
				});

				let mailOptions = {
					from: 'podscholar.app@gmail.com',
					to: request.body.account.email,
					subject: 'Recover your Account',
					text: message 
			};

				transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						console.log(error);
					} else {
						console.log('Email sent: ' + info.response);
					}
				});

				return response.status(200).json({ message: 'Email is sent' })
			}
		}
	} else {
		// If user exists, then send response 	
		response.status(406).json({ message: 'User already exists.' })
	}
});

router.post('/api/auth/authenticate', async (request, response) => {

	console.log(request.body.token)
	// Check if token exists 
	const token = await findValidationTokenByToken({ token: request.body.token })

	// Check stage user/creator by token id
	if (token != null) {
		const stageUser = await findStageUserById(token.userId)
		const stageCreator = await findStageCreator(token.userId)

		// Insert permanent user
		if (stageUser != null) {
			const primaryUser = await insertPrimaryUser(stageUser)

			if (stageCreator != null) {
				const primaryCreator = await insertPrimaryCreator(stageCreator)
			}

			// Update permanent user status
			const statusUpdated = await updatePrimaryUserStatus(primaryUser)

			// axios call: /api/auth/authenticate to delete stage user and validation token
			axios.delete('http://localhost:8080/api/auth/authenticate', { data: { id: id } })
				.then(function (res) {
					//succsesfully delete user in temporary collection 
					if (res.status == 200) {
						response.status(200).json({ message: 'User Authethicated' })
					}

				}).catch(function (err) {
					console.log(err)
				})
		}
		response.status(400).json({ message: 'Something went wrong.' })
	} else {
		response.status(400).json({ message: 'Something went wrong.' })
	}
});

router.delete('/api/auth/authenticate', async (request, response) => {
	console.log(request.body.id);

	// Delete from stage user collection 
	let isStageUserDeleted = await deleteStageUser({ _id: new ObjectId(request.body.id) })

	// Delete from stage creator collection
	let isStageCreatorDeleted = await deleteStageCreator({ _id: new ObjectId(request.body.id) })

	// Delete validaiton token
	let isTokenDeleted = await deleteValidationToken({ userId: request.body.id })

	if (isStageUserDeleted != null) {
		response.status(200).json({ message: 'User is deleted from the temporary user collection' })
	} else {
		response.status(400).json({ message: 'Something went wrong.' })
	}
});

router.post('/api/auth/login', async (request, response) => {

	console.log(request.body)
	const salt = process.env.SALT

	// Check if user exists 
	let user = await findUserByEmail(request.body.email)

	if (user != null) {
		if (user.account.password != bcrypt.hashSync(request.body.password, salt).replace(`${salt}.`, '')) {
			response.json(406).json({ message: 'Wrong Password' })
		} else {
			let id = user._id.toString().replace('New ObjectId("', '').replace('")', '')
			console.log(id)

			// generate JWT token
			const token = {
				token: accessToken,
				userId: id,
				date: new Date()
			}

			const accessToken = await insertToken(token);

			if (validationToken != null) {
				response.status(201).cookie("access_token", accessToken, {
					httpOnly: true
				}).json({ message: 'User Created' })
			} else {
				response.status(406).json({ message: 'User is not registered' })
			}

		}
	} else {
		response.status(406).json({ message: 'User is not registered' })
	}

});

router.get('/api/auth/recover', async (request, response) => {
	// TODO: response: send email containing generated account recovery authentication token

	console.log(request.body.email)

	const user = await findUserByEmail(request.body.email)

	if (user != null) {
		// generate token
		let id = user._id.toString().replace('New ObjectId("', '').replace('")', '')
		console.log(id)

		// generate JWT token
		const token = {
			token: accessToken,
			userId: id,
			date: new Date()
		}

		const recoveryToken = await insertToken(token);

		if (recoveryToken != null) {
			// Send an email
			const message = 'Recovery Link: ' + recoveryToken;

			let transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: 'podscholar.app@gmail.com',
					pass: 'podscholarapp@2022'
				}
			});

			let mailOptions = {
				from: 'podscholar.app@gmail.com',
				to: request.body.email,
				subject: 'Recover your Account',
				text: message 
			};

			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.log(error);
				} else {
					console.log('Email sent: ' + info.response);
				}
			});

			response.status(200).json({ message: 'Email is sent' })
		} else {
			response.status(406).json({ message: 'Something went wrong' })
		}


	} else {
		response.status(403).json({ message: 'Email is not registered' })
	}
});

router.patch('/api/auth/recover', async (request, response) => {
	let tokenExists = await findAccessTokenByToken(request.body.token)

	if (tokenExists != null) {
		jwt.verify(recoveryToken, process.env.ACCESS_TOKEN_SECRET, async (error, user) => {
			if (error) return console.log(error)
			
			let newPassword = toHash(request.body.password)

			const result = await updatePassword(user.userId, newPassword)

			if(result != null) {
				response.status(200).json({ message: 'Account recovered..'})
			} else {
				response.status(406).json({ message: 'Something went wrong.'})
			}
		  })
	} else {
		response.status(403).json({ message: 'This is not a valid token'})
	}
});

module.exports = router;