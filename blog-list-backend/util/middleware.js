const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
	console.log(error.name);
	console.log(error.message);

	if (error.name === "SequelizeValidationError") {
		return response.status(400).json({ error: "incomplete form" });
	} else if (error.name === "SequelizeDatabaseError") {
		return response.status(400).json({ error: "invalid query" });
	}

	next(error);
};

module.exports = {
	unknownEndpoint,
	errorHandler,
};