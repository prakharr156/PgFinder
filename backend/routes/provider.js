const express = require('express');
const router = express.Router();
const providers = require('../models/provider');
const {isRoleAdmin, isLoggedIn, isCurrentUserOrAdmin, isCurrentUser, isRoleProvider} = require("../middlewares/role_validator");
const {validateProviderDetails} = require('../middlewares/schema_validator');
const {uploadProviderFiles} = require("../middlewares/file_uploader");
const logins = require('../models/login');
const properties = require('../models/property');
const bookings = require('../models/booking');

router.use(isLoggedIn);

router.get('/', isRoleAdmin, async (req, res) => {
	try {
		let {skip} = req.query;

		if (!skip || skip < 0) {
			req.query.skip = 0;
			skip = 0;
		}

		const results = await providers.find({}).skip(skip).limit(10);

		return res.json({
			type: 'provider',
			results,
			query: req.query,
			isFirst: skip === 0,
			isLast: results.length < 10,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({error: 'Internal server error!'});
	}
});

router.get('/dashboard', isRoleProvider, (req, res) => {
	res.json({redirectTo: `/provider/${req.session.userRoleID}`});
});

router.post('/register', isLoggedIn, isRoleProvider, uploadProviderFiles.fields([{name: 'profile-pic'}, {name: 'license-validity'}]), validateProviderDetails, async (req, res) => {
	try {
		const id = req.session.userRoleID;
		const {phone, dob, gst, licenseValidUpto, addBuilding, addL1, addL2, landmark, state, city, zipCode} = req.body;
		const provider = await providers.findById({_id: id});

		if (!provider)
			return res.status(404).json({error: 'Provider not found!'});

		const address = {
			building: addBuilding,
			addL1: addL1,
			addL2: addL2,
			landmark: landmark,
			city: city,
			state: state,
			zipcode: zipCode,
			country: 'India'
		}

		const uploadedFiles = req.files || {};
		const profilePic = uploadedFiles['profile-pic'] ? uploadedFiles['profile-pic'][0].path : provider.profilePic;
		const licenseValidity = uploadedFiles['license-validity'] ? uploadedFiles['license-validity'][0].path : provider.licenseValidity;

		const updatedProvider = await providers.findOneAndUpdate({_id: id}, {
			phone,
			dob,
			gst,
			profilePic,
			licenseValidity,
			licenseValidUpto,
			address
		}, {new: true});

		await logins.findOneAndUpdate({username: req.user.username}, {isFilled: true});
		req.session.userDet = updatedProvider;
		req.session.userRoleID = updatedProvider.id;
		res.json({
			success: 'Provider Registered Successfully!',
			userInfo: updatedProvider,
			redirectTo: '/property/new'
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({error: 'Internal server error!'});
	}
});

router.get('/:id', isCurrentUserOrAdmin, async (req, res) => {
	try {
		const {id} = req.params;
		const userInfo = await providers.findOne({_id: id});

		if (!userInfo)
			return res.status(404).send({error: true, message: 'User not found!'});

		await userInfo.populate('properties');
		await userInfo.populate({
			path: 'bookingPending',
			populate: [
				{ path: 'by' },
				{ path: 'property' }
			]
		});

		await userInfo.populate({
			path: 'bookingCompleted',
			populate: [
				{ path: 'by' },
				{ path: 'property' }
			]
		});

		res.json({userInfo});
	} catch (e) {
		console.log(e);
		res.status(500).json({error: 'Internal server error!'});
	}
});

router.get('/:id/new-user', isCurrentUser, async (req, res) => {
	try {
		const {id} = req.params;
		const userInfo = await providers.findById({_id: id});
		res.json({userInfo});
	} catch (e) {
		console.log(e);
		res.status(500).json({error: 'Internal server error!'});
	}
})
router.get('/:id/edit', isCurrentUser, async (req, res) => {
	try {
		const {id} = req.params;
		const userInfo = await providers.findById({_id: id});
		res.json({userInfo});
	} catch (e) {
		console.log(e);
		res.status(500).json({error: 'Internal server error!'});
	}
});

router.patch('/:id', isCurrentUser, uploadProviderFiles.fields([{name: 'profile-pic'}, {name: 'license-validity'}]), validateProviderDetails, async (req, res) => {
	try {
		const {id} = req.params;
		const {email, phone, dob, gst, licenseValidUpto, addBuilding, addL1, addL2, landmark, state, city, zipCode} = req.body;
		const provider = await providers.findById({_id: id});

		const address = {
			building: addBuilding,
			addL1: addL1,
			addL2: addL2,
			landmark: landmark,
			city: city,
			state: state,
			zipcode: zipCode,
			country: 'India'
		}

		const uploadedFiles = req.files || {};
		const profilePic = uploadedFiles['profile-pic'] ? uploadedFiles['profile-pic'][0].path : provider.profilePic;
		const licenseValidity = uploadedFiles['license-validity'] ? uploadedFiles['license-validity'][0].path : provider.licenseValidity;

		const updatedProvider = await providers.findOneAndUpdate({_id: id}, {
			phone: phone,
			dob: dob,
			gst: gst,
			profilePic: profilePic,
			licenseValidity: licenseValidity,
			licenseValidUpto: licenseValidUpto,
			address: address
		}, {new: true});

		await logins.findOneAndUpdate({username: email || req.user.username}, {isFilled: true});
		req.session.userDet = updatedProvider;
		req.session.userRoleID = updatedProvider.id;
		res.json({success: 'Profile Updated!'}); // working properly
	} catch (e) {
		console.log(e);
		res.status(500).json({error: 'Internal server error!'});
	}
});

router.get('/:id/properties', isCurrentUserOrAdmin, async (req, res) => {
	try {
		const {id} = req.params;
		const user = await providers.findOne({_id: id});
		await user.populate('properties');
		const likes = user.likes;
		res.json(likes);
	} catch (e) {
		console.log(e);
		res.status(500).json({error: 'Internal server error!'});
	}
});

router.get('/:id/bookings-completed', isCurrentUserOrAdmin, async (req, res) => {
	try {
		const {id} = req.params;
		const user = await providers.findOne({_id: id});
		await user.populate('bookingCompleted');
		const completedBookings = user.bookingCompleted;
		res.json(completedBookings);
	} catch (e) {
		console.log(e);
		res.status(500).json({error: 'Internal server error!'});
	}
});

router.get('/:id/bookings-pending', isCurrentUserOrAdmin, async (req, res) => {
	try {
		const {id} = req.params;
		const user = await providers.findOne({_id: id});
		await user.populate('bookingPending');
		const pendingBookings = user.bookingPending;
		res.json(pendingBookings);
	} catch (e) {
		console.log(e);
		res.status(500).json({error: 'Internal server error!'});
	}
});

router.delete('/:id', isRoleAdmin, async (req, res) => {
	try {
		const {id} = req.params;
		const providerToDelete = await providers.findById({_id: id});

		providerToDelete.properties.map(async pID => {
			await bookings.deleteMany({property: pID, completed: false});
			await properties.findByIdAndDelete({_id: pID});
		});

		await logins.findOneAndDelete({username: providerToDelete.email});
		await providers.deleteOne(providerToDelete);
		res.json({success: 'User deleted successfully!'});
	} catch (e) {
		console.log(e);
		res.status(500).json({error: 'Internal server error!'});
	}
});

module.exports = router;
