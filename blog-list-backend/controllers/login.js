const jwt = require("jsonwebtoken");
const router = require("express").Router();

const { SECRET } = require("../util/config");
const User = require("../models/user");
const Session = require("../models/session");
const { tokenExtractor } = require("../util/middleware");

router.post("/", async (request, response) => {
	const body = request.body;

	const user = await User.findOne({
		where: {
			username: body.username,
		},
	});

	const passwordCorrect = body.password === "secret";

	if (!(user && passwordCorrect)) {
		return response.status(401).json({
			error: "invalid username or password",
		});
	}

	if (user.disabled) {
		return response.status(401).json({
			error: "account disabled, please contact admin",
		});
	}

	const userForToken = {
		username: user.username,
		id: user.id,
	};

	const token = jwt.sign(userForToken, SECRET);

	const [session, created] = await Session.findOrCreate({
		where: {
			userId: user.id,
		},
		defaults: {
			active: true,
		},
	});

	if (!created) {
		session.active = true;
		await session.save();
	}

	response.status(200).send({ token, username: user.username, name: user.name });
});

router.post("/logout", tokenExtractor, async (request, response) => {
	const [session, created] = await Session.findOrCreate({
		where: {
			userId: request.decodedToken.id,
		},
		defaults: {
			active: false,
		},
	});

	if (!created) {
		session.active = false;
		await session.save();
	}

	response.status(200);
});

module.exports = router;
