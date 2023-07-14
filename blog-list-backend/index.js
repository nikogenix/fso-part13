const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");
const middleware = require("./util/middleware");

const blogsRouter = require("./controllers/blog");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const authorRouter = require("./controllers/author");
const readingListRouter = require("./controllers/reading_list");

app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/authors", authorRouter);
app.use("/api/readinglists", readingListRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

const start = async () => {
	await connectToDatabase();
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
};

start();
