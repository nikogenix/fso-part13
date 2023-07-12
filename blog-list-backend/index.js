require("dotenv").config();
const { Sequelize, Model, DataTypes } = require("sequelize");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const sequelize = new Sequelize(process.env.DATABASE_URL);

class Blog extends Model {}
Blog.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		author: {
			type: DataTypes.TEXT,
		},
		url: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		title: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		likes: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
	},
	{
		sequelize,
		underscored: true,
		timestamps: false,
		modelName: "blogs",
	}
);

Blog.sync();

app.get("/api/blogs", async (req, res) => {
	const blogs = await Blog.findAll();
	res.json(blogs);
});

app.get("/api/blogs/:id", async (req, res) => {
	const blog = await Blog.findByPk(req.params.id);
	if (blog) {
		res.json(blog);
	} else {
		res.status(404).end();
	}
});
app.post("/api/blogs", async (req, res) => {
	try {
		const blog = await Blog.create(req.body);
		return res.json(blog);
	} catch (error) {
		return res.status(400).json({ error });
	}
});

app.put("/api/blogs/:id", async (req, res) => {
	const blog = await Blog.findByPk(req.params.id);
	if (blog) {
		blog.likes = req.body.likes || ++blog.likes;
		await blog.save();
		res.json(blog);
	} else {
		res.status(404).end();
	}
});

app.delete("/api/blogs/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const blog = await Blog.destroy({ where: { id } });
		return res.status(200);
	} catch (error) {
		return res.status(400).json({ error });
	}
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
