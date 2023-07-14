const router = require("express").Router();

const { ReadingList } = require("../models");

router.post("/", async (req, res) => {
	const entry = await ReadingList.create(req.body);
	res.json(entry);
});

module.exports = router;
