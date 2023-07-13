const { SECRET } = require("./config");
const jwt = require("jsonwebtoken");

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
	console.log(error.name);
	console.log(error.message);

	if (error.name === "SequelizeValidationError") {
		return response.status(400).json({ error: "incomplete or incorrect input" });
	} else if (error.name === "SequelizeDatabaseError") {
		return response.status(400).json({ error: "invalid query" });
	} else if (error.name === "SequelizeUniqueConstraintError") {
		return response.status(400).json({ error: "username needs to be unique" });
	}

	next(error);
};

const tokenExtractor = (req, res, next) => {
	const authorization = req.get("authorization");
	if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
		try {
			req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
		} catch {
			return res.status(401).json({ error: "token invalid" });
		}
	} else {
		return res.status(401).json({ error: "token missing" });
	}
	next();
};

module.exports = {
	unknownEndpoint,
	errorHandler,
	tokenExtractor,
};
