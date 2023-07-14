const router = require("express").Router();

const { User, Blog, ReadingList } = require("../models");

const userFinderByID = async (req, res, next) => {
	let where = {};

	if (req.query.read) {
		where = {
			read: req.query.read,
		};
	}

	req.user = await User.findByPk(req.params.id, {
		include: [
			{
				model: Blog,
				as: "blogs_added",
				attributes: ["id", "title", "url", "author", "likes", "year"],
			},
			{
				model: Blog,
				attributes: ["id", "title", "url", "author", "likes", "year"],
				through: {
					attributes: ["read", "id"],
					as: "info",
					where,
				},
				as: "reading_list",
			},
		],
	});
	next();
};

const userFinderByName = async (req, res, next) => {
	req.user = await User.findOne({
		where: { username: req.params.username },
		include: {
			model: Blog,
			as: "blogs_added",
			attributes: ["id", "title", "url", "author", "likes", "year"],
		},
	});
	next();
};

router.get("/", async (req, res) => {
	const users = await User.findAll({
		include: {
			model: Blog,
			as: "blogs_added",
			attributes: ["id", "title", "url", "author", "likes", "year"],
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
