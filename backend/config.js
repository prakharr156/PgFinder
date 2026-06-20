const path = require('path');
require('dotenv').config({path: path.join(__dirname, 'secret.env')});

module.exports = {
	databaseURL: process.env.DATABASE_URL,
	baseURL: (process.env.BASE_URL || '').replace(/\/$/, ''),
	clientURL: (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, ''),
	emailAdd: process.env.EMAIL_ADDRESS,
	appPass: process.env.APP_PASSCODE,
	port: process.env.PORT || 3000,
	sessionSecret: process.env.SESSION_SECRET,
	zipcodeKey: process.env.ZIPCODE_STACK_KEY,
	cloudName: process.env.CLOUD_NAME,
	cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
	cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
	adminKey: process.env.ADMIN_KEY,
	razorpayKeyID: process.env.RAZORPAY_KEY_ID,
	razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
	serverURL: (process.env.BASE_URL || '').replace(/\/$/, ''),
};
