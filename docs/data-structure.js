const user = {
	account: {
		email: 'caporusson1@nku.edu',
		password: 'password',
		registerDate: '2022-05-13',
		status: 'validated',
	},

	profile: {
		avatar: 'https://i.imgur.com/wWbeuk9.jpg',
		name: {
			first: 'nicholas',
			last: 'caporusso'
		},
		username: 'nicholascaporusso'
	},

	curation: {
		category: [ ],
		creator: [ ],
		keyword: [ ],
		podcast: {
			bookmark: [ ],
			like: [ ]
		}
	}
}

const creator = {
	accreditation: {
		orcid: '0000-0002-8661-4868'
	},

	affiliation: {
		institution: 'Northern Kentucky University',
		position: 'Assistant Professor of Computer Science'
	},

	content: {
		creator: [ ],

		curation: {
			category: [ 'computer science', 'data science' ],
			keyword: [ 'ieee', 'human-computer interaction' ]
		}
	},

	metric: {
		creator: {
			follow:  [ ]
		},

		podcast: {
			bookmark: [ ],
			like: [ ]
		}
	},

	profile: {
		about: 'I believe software engineering tools, methodologies, philosophies, design approaches, systems thinking, and processes can be used to to solve broader types of problems outside software development—individual, team, and even country development.'
	},

	social: {
		github: 'https://github.com/NicholasCaporusso',
		googleScholar: 'https://scholar.google.co.in/citations?user=4T9RQfcAAAAJ&hl=en',
		linkedIn: 'https://www.linkedin.com/in/nicholascaporusso/',
		twitter: 'https://twitter.com/cprnhl'
	}
}

const podcast = {
	content: {
		audio: {
			duration: '14:24',
			file: ''
		},

		category: 'computer science',
		creator: 'nicholascaporusso',
		date: '2022-04-23',
		keyword: [ 'pandemic', 'personal protection equipment', 'human-computer interaction' ]
	},

	metric: {
		bookmark: [ ],
		like: [ ]
	},

	source: {
		abstract: 'The COVID-19 pandemic required the adoption of several health-safety practices that have been demonstrated to be crucial for limiting the spread of the virus, including the use of personal protection equipment (PPE). Particularly, face masks have become a ubiquitous component of our daily lives. However, despite their effectiveness, they have several drawbacks. In addition to being uncomfortable for many users, they entirely cover the mouth, which, in turn, poses limitations to non-verbal communication and interpersonal interaction. In this paper, we present the user-centered design process of a solution that augments face masks with additional features that support interaction, awareness, and engagement.',
		author:	[ { name: 'Leo Christen' }, { name: 'Tami Farber' }, { name: 'Nicholas Caporusso', email: 'caporusson1@nku.edu' } ],
		date: '2021-07-08',
		doi: '10.1007/978-3-030-80744-3_77',
		publisher: 'Springer',
		title: 'Face Masks as Awareness and Engagement Platforms'
	}
}