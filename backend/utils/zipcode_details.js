const {zipcodeKey} = require('../config');
const axios = require('axios');

async function getZipcodeDetails (zipcode) {
	if (!zipcodeKey)
		return {warning: 'Zipcode verification skipped because API key is not configured.'};

	try {
		const requestURL = `https://api.zipcodestack.com/v1/search?codes=${zipcode}&country=in&apikey=${zipcodeKey}`;
		const res = await axios.get(requestURL);
		const result = res.data?.results?.[`${zipcode}`]?.[0];

		if (!result)
			return {warning: 'Zipcode verification skipped because no matching data was returned.'};

		return result;
	} catch (err) {
		return {warning: 'Zipcode verification skipped because the verification service failed.'};
	}
}

module.exports = {
	getZipcodeDetails,
}
