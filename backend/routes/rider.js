const express = require('express');
const router = express.Router();
const riders = require('../models/rider');
const {isRoleAdmin, isLoggedIn, isCurrentUserOrAdmin, isCurrentUser, isRoleRider} = require("../middlewares/role_validator");
const {validateRiderDetails} = require('../middlewares/schema_validator');
const {uploadRiderFiles} = require("../middlewares/file_uploader");
const logins = require('../models/login');
const providers = require('../models/provider');
const bookings = require('../models/booking');
const properties = require('../models/property');

router.use(isLoggedIn);

router.get('/', isRoleAdmin, async (req, res) => {
	try {
		let {skip} = req.query;

		if (!skip || skip < 0) {
			req.query.skip = 0;
			skip = 0;
		}

		const results = await riders.find({}).skip(skip).limit(10);

		return res.json({
			type: 'rider',
			results,
			query: req.query,
			isFirst: skip === 0,
			isLast: results.length < 10,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({error: 'Internal error!'});
	}
});

router.get('/dashboard', isRoleRider, (req, res) => {
	try {
		res.json({redirectTo: `/rider/${req.session.userRoleID}`});
	} catch (e) {
		res.status(500).json({error: 'Internal server error'});
	}
});

router.post('/update',
	isRoleRider,
	uploadRiderFiles.fields([{name: "profile-pic"}, {name: "covid-cert"}]),
	validateRiderDetails,
	async (req, res) => {
	try {
		const id = req.session.userRoleID;
		const {phone, gender, dob, occupation, emContactName, emContactRelation, emContactPhone} = req.body;

		const user = await riders.findById({_id: id});
		if (!user)
			return res.status(404).json({error: 'User not found!'});

		const imageLink = req.files['profile-pic'] ? req.files['profile-pic'][0].path : user.profilePic;
		const covidCertLink = req.files['covid-cert'] ? req.files['covid-cert'][0].path : user.covidCert;

		const updateEmContact = {
			name: emContactName,
			relation: emContactRelation,
			phone: emContactPhone
		};

		const updatedUser = await riders.findOneAndUpdate({_id: id}, {
			phone,
			gender,
			dob,
			occupation,
			profilePic: imageLink,
			covidCert: covidCertLink,
			emergencyContact: updateEmContact
		}, {new: true});

		await logins.findOneAndUpdate({username: req.user.username}, {isFilled: true});
		req.session.userDet = updatedUser;
		req.session.userRoleID = updatedUser.id;
		res.json({success: 'Profile Updated!', userInfo: updatedUser});
	} catch (e) {
		console.log(e);
		res.status(500).json({error: e.message || 'Internal server error'});
	}
});

router.get('/:id', isCurrentUserOrAdmin, async (req, res) => {
	try {
		const {id} = req.params;
		const userInfo = await riders.findOne({_id: id});

		if (!userInfo)
			return res.status(404).json({error: 'User not found!'});

		await userInfo.populate({
			path: 'bookings',
			populate: {
				path: 'property'
			},
			sort: {
				date: -1
			}
		});

		await userInfo.populate('likes');
		res.json({userInfo});
	} catch (e) {
		res.status(500).json({error: 'Internal server error!'});
	}
});

router.get('/:id/new-user', isCurrentUser, async (req, res) => {
	try {
		const {id} = req.params;
		const userInfo = await riders.findOne({_id: id});
		res.json({userInfo});
	} catch (e) {
		res.status(500).json({error: 'Internal server error'});
	}
});

router.get('/:id/edit', isCurrentUser, async (req, res) => {
	try {
		const {id} = req.params;
		const userInfo = await riders.findOne({_id: id});
		res.json({userInfo});
	} catch (e) {
		res.status(500).json({error: 'Internal server error! Check your permissions!'});
	}
});

router.patch('/:id',
	isCurrentUser,
	uploadRiderFiles.fields([{name: "profile-pic"}, {name: "covid-cert"}]),
	validateRiderDetails,
	async (req, res) => {
	try {
		const {id} = req.params;
		const {email, phone, gender, dob, occupation, emContactName, emContactRelation, emContactPhone} = req.body;

		const user = await riders.findById({_id: id});

		const imageLink = req.files['profile-pic'] ? req.files['profile-pic'][0].path : user.profilePic;
		const covidCertLink = req.files['covid-cert'] ? req.files['covid-cert'][0].path : user.covidCert;

		const updateEmContact = {
			name: emContactName,
			relation: emContactRelation,
			phone: emContactPhone
		};

		await riders.findOneAndUpdate({_id: id}, {
			phone: phone,
			gender: gender,
			dob: dob,
			occupation: occupation,
			profilePic: imageLink,
			covidCert: covidCertLink,
			emergencyContact: updateEmContact
		});

		await logins.findOneAndUpdate({username: email || req.user.username}, {isFilled: true});
		res.json({success: 'Profile Updated!'}); // working properly
	} catch (e) {
		console.log(e);
		res.status(500).send({error: e.message || 'Internal server error'});
	}
});

router.delete('/:id', isRoleAdmin, async (req, res) => {
	try {
		const {id} = req.params;

		const user = await riders.findById({_id: id});
		await user.populate('bookings');

		// deleting all the pending bookings from both bookings collection and providers list.
		for (const booking of user.bookings) {
			await providers.updateOne({_id: booking.owner},
				{$pull: {bookingsPending: booking._id}});

			if (!booking.completed)
				await bookings.deleteOne({_id: booking.id});
		}

		// reducing like count of all properties which were in the likes of this user.
		user.likes.map(async propertyId => {
			await properties.updateOne(
				{_id: propertyId},
				{$inc: {interested: -1}});
		});

		await riders.deleteOne(user);
		await logins.findByIdAndDelete({_id: req.user.id});
		res.json({success: 'User deleted successfully'});
	} catch (e) {
		console.log(e);
		res.json({error: 'Could not delete user!'});
	}
});

module.exports = router;
