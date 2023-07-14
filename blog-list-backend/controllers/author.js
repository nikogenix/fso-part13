const router = require("express").Router();

const { Blog } = require("../models");
const { sequelize } = require("../util/db");

router.get("/", async (req, res) => {
	const blogs = await Blog.findAll({
		attributes: [
			"author",
			[sequelize.fn("SUM", sequelize.col("likes")), "likes"],
			[sequelize.fn("COUNT", sequelize.col("title")), "articles"],
		],
		group: "author",
		order: [["likes", "DESC"]],
	});

	res.json(blogs);
});

module.exports = router;
