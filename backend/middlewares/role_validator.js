// function isRoleAdmin (req, res, next) {
// 	const current = req.user;

// 	if (!current)
// 		return res.status(401).send({error: 'Unauthorized access!'});

// 	if (current.role !== 'admin')
// 		return res.status(403).send({error: 'Invalid access!'});

// 	next();
// }

// function isRoleRider (req, res, next) {
// 	const current = req.user;

// 	if (!current)
// 		return res.status(401).send({error: 'Unauthorized access!'});

// 	if (current.role !== 'rider')
// 		return res.status(403).send({error: 'Invalid access!'});

// 	next();
// }

// function isRoleProvider (req, res, next) {
// 	const current = req.user;

// 	if (!current)
// 		return res.status(401).send({error: 'Unauthorized access!'});

// 	if (current.role !== 'provider')
// 		return res.status(403).send({error: 'Invalid access!'});

// 	next();
// }

// function isRoleAdminOrRider (req, res, next) {
// 	const current = req.user;

// 	if (!current)
// 		return res.status(401).send({error: 'Unauthorized access!'});

// 	if (current.role !== 'admin' && current.role !== 'rider')
// 		return res.status(403).send({error: 'Invalid access!'});

// 	next();
// }

// function isRoleAdminOrProvider (req, res, next) {
// 	const current = req.user;

// 	if (!current)
// 		return res.status(401).send({error: 'Unauthorized access!'});

// 	if (current.role !== 'admin' && current.role !== 'provider')
// 		return res.status(403).send({error: 'Invalid access!'});

// 	next();
// }

// function isLoggedIn (req, res, next) {
// 	req.session.redirectUrl = req.originalUrl;

// 	if (!req.isAuthenticated())
// 		return res.status(401).json({
// 			error: 'Unauthorized access!',
// 			redirectTo: '/auth/login'
// 		});

// 	next();
// }

// function isAdminLoggedIn (req, res, next) {
// 	if (!req.isAuthenticated())
// 		return res.status(401).json({
// 			error: 'Admin login required!',
// 			redirectTo: '/auth/admin-login'
// 		});

// 	next();
// }

// function isCurrentUserOrAdmin (req, res, next) {
// 	const {id} = req.params;

// 	if (req.user.role === 'admin')
// 		return next();

// 	if (req.session.userRoleID === id)
// 		return next();

// 	res.status(403).send({error: 'Not Authorized!'});
// }

// function isCurrentUser (req, res, next) {
// 	const {id} = req.params;

// 	if (req.session.userRoleID === id)
// 		return next();

// 	res.status(403).send({error: 'Not Authorized'});
// }

// module.exports = {
// 	isRoleAdmin,
// 	isRoleRider,
// 	isRoleProvider,
// 	isRoleAdminOrRider,
// 	isRoleAdminOrProvider,
// 	isLoggedIn,
// 	isCurrentUserOrAdmin,
// 	isCurrentUser,
// 	isAdminLoggedIn,
// }

const riders = require('../models/rider');
const providers = require('../models/provider');

function idsMatch(first, second) {
	return first && second && first.toString() === second.toString();
}

async function getCurrentRoleID(req) {
	if (req.session.userRoleID) {
		return req.session.userRoleID;
	}

	if (!req.user) {
		return null;
	}

	const model = req.user.role === 'rider'
		? riders
		: req.user.role === 'provider'
			? providers
			: null;

	if (!model) {
		return null;
	}

	const roleUser = await model.findOne({ email: req.user.username }).select('_id');

	if (!roleUser) {
		return null;
	}

	req.session.userRoleID = roleUser.id;
	return roleUser.id;
}

function isLoggedIn(req, res, next) {
	req.session.redirectUrl = req.originalUrl;

	if (!req.isAuthenticated()) {
		return res.status(401).json({
			error: 'Unauthorized access!',
			redirectTo: '/auth/login'
		});
	}

	if (!req.user) {
		return res.status(401).json({
			error: 'User session expired!'
		});
	}

	next();
}

function isAdminLoggedIn(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(401).json({
			error: 'Admin login required!',
			redirectTo: '/auth/admin-login'
		});
	}

	if (!req.user) {
		return res.status(401).json({
			error: 'User session expired!'
		});
	}

	next();
}

function isRoleAdmin(req, res, next) {
	if (!req.user) {
		return res.status(401).json({
			error: 'Unauthorized access!',
			redirectTo: '/auth/login'
		});
	}

	if (req.user.role !== 'admin') {
		return res.status(403).json({
			error: 'Invalid access!'
		});
	}

	next();
}

function isRoleRider(req, res, next) {
	if (!req.user) {
		return res.status(401).json({
			error: 'Unauthorized access!',
			redirectTo: '/auth/login'
		});
	}

	if (req.user.role !== 'rider') {
		return res.status(403).json({
			error: 'Invalid access!'
		});
	}

	next();
}

function isRoleProvider(req, res, next) {
	if (!req.user) {
		return res.status(401).json({
			error: 'Unauthorized access!',
			redirectTo: '/auth/login'
		});
	}

	if (req.user.role !== 'provider') {
		return res.status(403).json({
			error: 'Invalid access!'
		});
	}

	next();
}

function isRoleAdminOrRider(req, res, next) {
	if (!req.user) {
		return res.status(401).json({
			error: 'Unauthorized access!',
			redirectTo: '/auth/login'
		});
	}

	if (
		req.user.role !== 'admin' &&
		req.user.role !== 'rider'
	) {
		return res.status(403).json({
			error: 'Invalid access!'
		});
	}

	next();
}

function isRoleAdminOrProvider(req, res, next) {
	if (!req.user) {
		return res.status(401).json({
			error: 'Unauthorized access!',
			redirectTo: '/auth/login'
		});
	}

	if (
		req.user.role !== 'admin' &&
		req.user.role !== 'provider'
	) {
		return res.status(403).json({
			error: 'Invalid access!'
		});
	}

	next();
}

async function isCurrentUserOrAdmin(req, res, next) {
	const { id } = req.params;

	if (!req.user) {
		return res.status(401).json({
			error: 'Unauthorized access!',
			redirectTo: '/auth/login'
		});
	}

	if (req.user.role === 'admin') {
		return next();
	}

	try {
		const currentRoleID = await getCurrentRoleID(req);

		if (idsMatch(currentRoleID, id)) {
			return next();
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: 'Internal server error!'
		});
	}

	return res.status(403).json({
		error: 'Not Authorized!'
	});
}

async function isCurrentUser(req, res, next) {
	const { id } = req.params;

	if (!req.user) {
		return res.status(401).json({
			error: 'Unauthorized access!',
			redirectTo: '/auth/login'
		});
	}

	try {
		const currentRoleID = await getCurrentRoleID(req);

		if (idsMatch(currentRoleID, id)) {
			return next();
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: 'Internal server error!'
		});
	}

	return res.status(403).json({
		error: 'Not Authorized!'
	});
}

module.exports = {
	isLoggedIn,
	isAdminLoggedIn,
	isRoleAdmin,
	isRoleRider,
	isRoleProvider,
	isRoleAdminOrRider,
	isRoleAdminOrProvider,
	isCurrentUserOrAdmin,
	isCurrentUser
};
