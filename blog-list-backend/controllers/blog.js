const router = require("express").Router();

const { Blog } = require("../models");

router.get("/", async (req, res) => {
	const blogs = await Blog.findAll();
	res.json(blogs);
});

router.get("/:id", async (req, res) => {
	const blog = await Blog.findByPk(req.params.id);
	if (blog) {
		res.json(blog);
	} else {
		res.status(404).end();
	}
});

router.post("/", async (req, res) => {
	try {
		const blog = await Blog.create(req.body);
		return res.json(blog);
	} catch (error) {
		return res.status(400).json({ error });
	}
});

router.put("/:id", async (req, res) => {
	const blog = await Blog.findByPk(req.params.id);
	if (blog) {
		blog.likes = req.body.likes || ++blog.likes;
		await blog.save();
		res.json(blog);
	} else {
		res.status(404).end();
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const blog = await Blog.destroy({ where: { id } });
		return res.status(200);
	} catch (error) {
		return res.status(400).json({ error });
	}
});

module.exports = router;
