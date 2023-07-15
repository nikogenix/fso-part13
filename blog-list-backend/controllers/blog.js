const router = require("express").Router();

const { Op } = require("sequelize");

const { User, Blog } = require("../models");
const { tokenExtractor } = require("../util/middleware");

const blogFinder = async (req, res, next) => {
	req.blog = await Blog.findByPk(req.params.id, {
		attributes: ["id", "title", "url", "author", "likes", "year"],
		include: {
			model: User,
			as: "user",
		},
	});
	next();
};

router.get("/", tokenExtractor, async (req, res) => {
	let where = {};

	if (req.query.search) {
		where = {
			[Op.or]: [
				{ title: { [Op.iLike]: `%${req.query.search}%` } },
				{ author: { [Op.iLike]: `%${req.query.search}%` } },
			],
		};
	}

	const blogs = await Blog.findAll({
		attributes: ["id", "title", "url", "author", "likes", "year"],
		include: {
			model: User,
			as: "user",
		},
		where,
		order: [["likes", "DESC"]],
	});
	res.json(blogs);
});

router.get("/:id", tokenExtractor, blogFinder, async (req, res) => {
	if (req.blog) {
		res.json(req.blog);
	} else {
		res.status(404).end();
	}
});

router.post("/", tokenExtractor, async (req, res) => {
	const user = await User.findByPk(req.decodedToken.id);
	const blog = await Blog.create({ ...req.body, userId: user.id });
	return res.json(blog);
});

router.put("/:id", blogFinder, tokenExtractor, async (req, res) => {
	if (req.blog) {
		req.blog.likes = req.body.likes || ++req.blog.likes;
		await req.blog.save();
		res.json(req.blog);
	} else {
		res.status(404).end();
	}
});

router.delete("/:id", blogFinder, tokenExtractor, async (req, res) => {
	if (req.blog) {
		if (req.blog.user.id === req.decodedToken.id) await req.blog.destroy();
		else res.status(401).end();
	}
	res.status(204).end();
});

module.exports = router;
