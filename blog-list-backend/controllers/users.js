const router = require("express").Router();

const { User, Blog } = require("../models");

const userFinderByID = async (req, res, next) => {
	req.user = await User.findByPk(req.params.id, {
		include: {
			model: Blog,
		},
	});
	next();
};

const userFinderByName = async (req, res, next) => {
	req.user = await User.findOne({
		where: { username: req.params.username },
		include: {
			model: Blog,
		},
	});
	next();
};

router.get("/", async (req, res) => {
	const users = await User.findAll({
		include: {
			model: Blog,
		},
	});
	res.json(users);
});

router.get("/:id", userFinderByID, async (req, res) => {
	if (req.user) {
		res.json(req.user);
	} else {
		res.status(404).end();
	}
});

router.post("/", async (req, res) => {
	const user = await User.create(req.body);
	res.json(user);
});

router.put("/:username", userFinderByName, async (req, res) => {
	if (req.user) {
		req.user.username = req.body.username;
		await req.user.save();
		res.json(req.user);
	} else {
		res.status(404).end();
	}
});

router.delete("/:id", userFinderByID, async (req, res) => {
	if (req.user) {
		await req.user.destroy();
	}
	res.status(204).end();
});

module.exports = router;
