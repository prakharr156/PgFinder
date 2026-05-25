const express = require('express');
const router = express.Router();
const {randomInt} = require('crypto');
const logins = require('../models/login');
const registrations = require('../models/register');
const {generateValidationKey, forgetPasswordKeyGenerator} = require('../utils/key_generator');
const {sendRegistrationEmail, sendForgotPasswordEmail, sendPasswordChangeEmail} = require('../utils/mail_sender');
const {validateRegistration, validateLogin} = require('../middlewares/schema_validator');
const riders = require('../models/rider');
const providers = require('../models/provider');
const keys = require('../models/key');
const passport = require('passport');
const {adminKey, clientURL} = require('../config');

const CAPTCHA_WORD_BANK = [
	'BALCONY',
	'LANDMARK',
	'HOSTEL',
	'SKYLINE',
	'GATEWAY',
	'CORRIDOR',
	'VERANDA',
	'JOURNEY',
	'PARKING',
	'VILLAGE'
];
const LOGIN_CAPTCHA_EXPIRY_MS = 10 * 60 * 1000;

function pickRandom(list) {
	return list[randomInt(list.length)];
}

function normalizeCaptchaAnswer(value) {
	return String(value || '').trim().toLowerCase().replace(/\s+/g, '');
}

function getUniquePositions(length, count) {
	const positions = new Set();

	while (positions.size < count)
		positions.add(randomInt(length));

	return Array.from(positions).sort((a, b) => a - b);
}

function buildArithmeticCaptcha() {
	const first = randomInt(11, 36);
	const second = randomInt(3, 13);
	const third = randomInt(2, 10);
	const pattern = randomInt(3);
	let question;
	let answer;

	if (pattern === 0) {
		question = `(${first} + ${second}) x ${third}`;
		answer = String((first + second) * third);
	} else if (pattern === 1) {
		question = `${first} - ${second} + ${third} x 2`;
		answer = String(first - second + (third * 2));
	} else {
		const multiplier = randomInt(2, 6);
		question = `${first} + ${second} x ${multiplier} - ${third}`;
		answer = String(first + (second * multiplier) - third);
	}

	return {question, answer};
}

function buildSequenceCaptcha() {
	const start = randomInt(4, 18);
	const step = randomInt(2, 7);
	const sequence = Array.from({length: 4}, (_, index) => start + (index * step));

	return {
		question: `What comes next: ${sequence.join(', ')}, ?`,
		answer: String(start + (4 * step))
	};
}

function buildWordPositionCaptcha() {
	const word = pickRandom(CAPTCHA_WORD_BANK);
	const positions = getUniquePositions(word.length, 3);
	const labels = positions.map(position => position + 1);
	const answer = positions.map(position => word[position]).join('');

	return {
		question: `Type letters ${labels.join(', ')} from ${word}`,
		answer
	};
}

function buildReverseCaptcha() {
	const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
	let token = '';

	while (token.length < 5)
		token += chars[randomInt(chars.length)];

	return {
		question: `Type this in reverse: ${token}`,
		answer: token.split('').reverse().join('')
	};
}

function generateLoginCaptcha() {
	const challenge = pickRandom([
		buildArithmeticCaptcha,
		buildSequenceCaptcha,
		buildWordPositionCaptcha,
		buildReverseCaptcha
	])();

	return {
		question: challenge.question,
		answer: normalizeCaptchaAnswer(challenge.answer),
	};
}

async function createLoginCaptcha() {
	const captcha = generateLoginCaptcha();
	const captchaRecord = await keys.create({
		key: `${generateValidationKey()}${Date.now()}`,
		purpose: 'login-captcha',
		content: {
			answer: captcha.answer
		}
	});

	return {
		question: captcha.question,
		key: captchaRecord.key,
		answer: captcha.answer
	};
}

function isUsableRedirect(redirectTo) {
	return redirectTo &&
		redirectTo !== '/' &&
		!redirectTo.startsWith('/auth/login') &&
		!redirectTo.startsWith('/auth/registration');
}

async function getPostLoginRedirect(user, requestedRedirect) {
	if (user.role !== 'provider' && isUsableRedirect(requestedRedirect))
		return requestedRedirect;

	if (user.role === 'admin')
		return '/admin';

	if (user.role === 'rider') {
		const rider = await riders.findOne({email: user.username});

		if (!rider)
			return '/property/search';

		return user.isFilled
			? '/property/search'
			: `/rider/${rider.id}/new-user`;
	}

	if (user.role === 'provider') {
		const provider = await providers.findOne({email: user.username});

		if (!provider)
			return '/property/search';

		return user.isFilled
			? `/provider/${provider.id}`
			: `/provider/${provider.id}/new-user`;
	}

	return '/property/search';
}

function authRedirect(params) {
	const url = new URL('/auth/login', clientURL);

	Object.entries(params).forEach(([key, value]) => {
		if (value)
			url.searchParams.set(key, value);
	});

	return url.toString();
}

async function getRoleProfile(user) {
	if (user.role === 'rider')
		return riders.findOne({email: user.username});

	if (user.role === 'provider')
		return providers.findOne({email: user.username});

	return null;
}

/* --------- REGISTRATION --------- */
router.get('/registration', (req, res) => {
	res.json({page: 'user-registration'});
});

router.post('/registration', validateRegistration, async (req, res) => {
	try {
		if (req.user)
			req.logout(err => {
				if (err)
					console.log('could not log out for registration due to ' + err);
			});

		const {email, pass, role, name} = req.body;
		const whether_login_present = await logins.findOne({username: email});

		if (whether_login_present)
			return res.status(400).send({error: 'user already exists'});

		const whether_registration_present = await registrations.findOne({email: email});
		if (whether_registration_present)
			await registrations.deleteOne({email: email});

		let validationKey, validationKeyAlreadyPresent;
		do {
			validationKey = generateValidationKey();
			validationKeyAlreadyPresent = await registrations.findOne({validationKey});
		} while (validationKeyAlreadyPresent)

		await registrations.create({
			email, pass, name, role, validationKey
		});

		const whether_email_sent = await sendRegistrationEmail(email, validationKey);
		if (!whether_email_sent) {
			console.log('email sending unsuccessful @ ' + Date.now());
			return res.status(500).json({error: 'internal server error, please re-register!'});
		}

		console.log(`email sent @ ${new Date().toISOString()} to email : ${email}.`);
		res.json({success: 'Please check your email to verify it.'});
	} catch (e) {
		res.status(500).json({error: 'Internal server error'});
	}
})

/* --------- VALIDATION --------- */

router.get('/validate', async (req, res) => {
	try {
		if (!req.query.validationKey)
			return res.redirect(authRedirect({
				verified: 'error',
				message: 'Validation key not provided.'
			}));

		const validationKey = String(req.query.validationKey || '').trim();
		const emailFromLink = String(req.query.email || '').trim().toLowerCase();
		const registrationFound = await registrations.findOne({validationKey});

		if (!registrationFound) {
			const alreadyValidated = emailFromLink
				? await logins.findOne({username: emailFromLink})
				: null;

			return res.redirect(authRedirect({
				verified: alreadyValidated ? 'already' : 'error',
				message: alreadyValidated
					? 'Account already verified. Please login.'
					: 'Invalid or expired validation link. Please register again.'
			}));
		}

		const {email, pass, name, role} = registrationFound;

		const isEmailAlreadyValidated = await logins.findOne({username: email});
		if (isEmailAlreadyValidated) {
			await registrations.deleteOne({validationKey});
			return res.redirect(authRedirect({
				verified: 'already',
				message: 'Account already verified. Please login.'
			}));
		}

		const createdLogin = await logins.register(new logins({ username: email, name: name, role: role }), pass);

		if (!createdLogin)
			return res.status(500).json({error: 'Internal Server Error, please try again!'});

		await registrations.deleteOne({validationKey});
		const newUser = {email: email, name: name};

		if (role === 'rider')
			await riders.create(newUser);

		else if (role === 'provider')
			await providers.create(newUser);

		else
			console.log('could not create profile, role not available ' + role);

		console.log('Account successfully created for user : ' + email);
		res.redirect(authRedirect({
			verified: 'success',
			message: 'Account verified successfully. Please login.'
		}));
	} catch (e) {
		res.redirect(authRedirect({
			verified: 'error',
			message: 'Could not verify account. Please try again.'
		}));
	}
})

/* --------- LOGIN & LOGOUT --------- */

router.get('/login', async (req, res) => {
	try {
		const captcha = await createLoginCaptcha();
		req.session.loginCaptcha = {
			answer: captcha.answer,
			key: captcha.key
		};
		res.json({
			attempt: req.query.attempt || 'first',
			captchaQuestion: captcha.question,
			captchaKey: captcha.key
		});
	} catch (e) {
		res.status(500).json({error: 'Internal server error'});
	}
})

router.post('/login', validateLogin, async (req, res, next) => {
	try {
		const {email, captchaAnswer, captchaKey} = req.body;
		let expectedCaptcha = req.session.loginCaptcha?.key === captchaKey
			? req.session.loginCaptcha?.answer
			: null;

		if (!expectedCaptcha && captchaKey) {
			const captchaRecord = await keys.findOne({
				key: captchaKey,
				purpose: 'login-captcha'
			});

			if (
				captchaRecord &&
				Date.now() - new Date(captchaRecord.createdAt).getTime() <= LOGIN_CAPTCHA_EXPIRY_MS
			) {
				expectedCaptcha = captchaRecord.content?.answer;
			}
		}

		if (!expectedCaptcha || normalizeCaptchaAnswer(captchaAnswer) !== expectedCaptcha) {
			const captcha = await createLoginCaptcha();
			req.session.loginCaptcha = {
				answer: captcha.answer,
				key: captcha.key
			};
			return res.status(401).json({
				error: 'Captcha verification failed.',
				attempt: 'captcha-failed',
				captchaQuestion: captcha.question,
				captchaKey: captcha.key
			});
		}

		const loginFound = await logins.findOne({username: email});
		const redirectTo = loginFound
			? await getPostLoginRedirect(loginFound, req.session.redirectUrl)
			: '/property/search';

		return passport.authenticate('passport-local', async (err, user) => {
			if (err)
				return next(err);

			if (!user) {
				const captcha = await createLoginCaptcha();
				req.session.loginCaptcha = {
					answer: captcha.answer,
					key: captcha.key
				};
				return res.status(401).json({
					error: 'Invalid email or password.',
					redirectTo: '/auth/login?attempt=failed',
					captchaQuestion: captcha.question,
					captchaKey: captcha.key
				});
			}

			req.login(user, async (loginErr) => {
				if (loginErr)
					return next(loginErr);

				try {
					delete req.session.loginCaptcha;
					if (captchaKey)
						keys.deleteOne({key: captchaKey, purpose: 'login-captcha'}).catch(console.log);

					const roleProfile = await getRoleProfile(user);
					if (roleProfile) {
						req.session.userDet = roleProfile;
						req.session.userRoleID = roleProfile.id;
					}

					return res.json({
						success: 'Login successful.',
						user: {
							id: user.id,
							name: user.name,
							email: user.username,
							role: user.role,
							isFilled: user.isFilled,
							roleID: roleProfile?.id || null
						},
						redirectTo: redirectTo || '/'
					});
				} catch (error) {
					return next(error);
				}
			});
		})(req, res, next);
	} catch (e) {
		res.status(500).json({error: 'Internal server error'});
	}
})

router.get('/admin-create', (req, res) => {
	try {
		res.json({page: 'admin-registration'});
	} catch (e) {
		res.status(500).json({error: 'Internal server error'});
	}
});

router.post('/admin-create', async (req, res) => {
	try {
		const {email, adminKey: providedAdminKey} = req.body;

		if (providedAdminKey !== adminKey)
			return res.status(406).json({error: 'BAD REQUEST, UNAUTHORIZED'});

		const login = await logins.findOne({username: email});
		if (!login)
			return res.status(404).json({error: 'User not found!'});

		login.role = 'admin';

		await riders.findOneAndDelete({email});
		await login.save();
		res.json({
			success: 'Admin account created successfully.',
			redirectTo: '/auth/admin-login'
		});
	} catch (e) {
		res.status(500).json({error: 'Internal server error'});
	}
})

router.get('/admin-login', (req, res) => {
	try {
		res.json({page: 'admin-login'});
	} catch (e) {
		res.status(500).json({error: 'Internal server error'});
	}
})

router.post('/admin-login', (req, res, next) => {
	passport.authenticate('passport-local', (err, user) => {
		if (err)
			return next(err);

		if (!user)
			return res.status(401).json({error: 'Invalid email or password.'});

		if (user.role !== 'admin')
			return res.status(403).json({error: 'Admin access required.'});

		req.login(user, (loginErr) => {
			if (loginErr)
				return next(loginErr);

			return res.json({
				success: 'Admin login successful.',
				user: {
					id: user.id,
					name: user.name,
					email: user.username,
					role: user.role
				},
				redirectTo: '/admin'
			});
		});
	})(req, res, next);
});

router.get('/logout', (req, res) => {
	try {
		req.logout(err => {
			if (err)
				return res.status(500).send({error: 'could not logout! Internal Server Failure!'});
		});

		console.log('user logged out!');
		res.json({success: 'Logged out successfully.', redirectTo: '/'});
	} catch (e) {
		res.status(500).json({error: 'Internal server error'});
	}
})

router.get('/forget-password', (req, res) => {
	try {
		if (req.user)
			req.logout(err => {
				if (err)
					return res.status(500).send({error: 'could not logout! Internal Server Failure!'});
			});

		res.json({page: 'forgot-password'});
	} catch (e) {
		res.status(500).json({error: 'Internal server error'});
	}
})

router.post('/forget-password', async (req, res) => {
	try {
		const {email} = req.body;

		const resetUser = await logins.findOne({username: email});

		if (!resetUser)
			return res.status(403).send({error: 'User does not exist!'});

		const key = forgetPasswordKeyGenerator();
		await keys.create({
			key: key,
			purpose: 'password',
			content: {
				name: resetUser.name,
				email: resetUser.username
			}
		});

		await sendForgotPasswordEmail(resetUser.username, key);
		res.json({success: 'Email sent successfully, check email to change password!'});
	} catch (e) {
		res.status(500).json({error: 'Internal server error'});
	}
})

router.get('/change-password', async (req, res) => {
	try {
		const {key} = req.query;

		const keyData = await keys.findOne({key: key});

		if (!keyData)
			return res.status(404).json({error: 'Reset request not found!'});

		res.json({page: 'reset-password', name: keyData.content.name, key});
	} catch (e) {
		res.status(500).json({error: 'Internal server error'});
	}
})

router.post('/change-password', async (req, res) => {
	try {
		const {pass, key} = req.body;

		const keyData = await keys.findOne({key: key});
		if (!keyData)
			return res.status(404).json({error: 'Reset request not found!'});

		const username = keyData.content.email;
		const resetUser = await logins.findOne({username: username});

		await new Promise((resolve, reject) => {
			resetUser.setPassword(pass, (err) => {
				if (err)
					return reject(err);

				resolve();
			});
		});
		await resetUser.save();

		await keys.deleteOne({key: key});
		await sendPasswordChangeEmail(username);
		return res.json({success: 'Password changed successfully!'});
	} catch (e) {
		res.status(500).json({error: 'Could not change password, internal server failure!'});
	}
});

module.exports = router;
