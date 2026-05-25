const express = require('express');
const {isRoleAdmin, isAdminLoggedIn} = require("../middlewares/role_validator");
const providers = require('../models/provider');
const riders = require('../models/rider');
const bookings = require('../models/booking');
const properties = require('../models/property');
const contacts = require('../models/contact');

const router = express.Router();

router.use(isAdminLoggedIn);
router.use(isRoleAdmin);

router.get('/', async (req, res) => {
	try {
		const [
			totalProperties,
			totalRiders,
			totalBookings,
			totalProviders,
			totalContacts
		] = await Promise.all([
			properties.countDocuments({}),
			riders.countDocuments({}),
			bookings.countDocuments({}),
			providers.countDocuments({}),
			contacts.countDocuments({})
		]);

		const balanceResult = await bookings.aggregate([
			{
				$lookup: {
					from: 'properties',
					localField: 'property',
					foreignField: '_id',
					as: 'property'
				}
			},
			{$unwind: '$property'},
			{
				$group: {
					_id: null,
					total: {$sum: {$ifNull: ['$property.bookingMoney', 0]}}
				}
			}
		]);
		const totalBalance = balanceResult[0]?.total || 0;

		res.json({
			location: 'admin-dashboard',
			success: 'successfully shown dashboard',
			data: {
				totalProperties,
				totalRiders,
				totalBookings,
				totalProviders, 
				totalContacts, 
				totalBalance,
			}
		});
	} catch (e) {
		res.status(500).json({error: e.message || 'Internal server error'});
	}
});

module.exports = router;
