function convertToArray (variable) {
	if (variable === undefined || variable === null || variable === '')
		return [];

	if (!Array.isArray(variable))
		return [variable];

	return variable;
}

module.exports = {
	convertToArray,
}
