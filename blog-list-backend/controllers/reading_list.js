const router = require("express").Router();

const { ReadingList } = require("../models");

const { tokenExtractor } = require("../util/middleware");

const listEntryFinder = async (req, res, next) => {
	req.listEntry = await ReadingList.findByPk(req.params.id);
	next();
};

router.post("/", async (req, res) => {
	const entry = await ReadingList.create(req.body);
	res.json(entry);
});

router.put("/:id", tokenExtractor, listEntryFinder, async (req, res) => {
	if (req.listEntry.userId !== req.decodedToken.id) res.status(401).end();
	if (typeof req.body.read !== "undefined") {
		req.listEntry.read = req.body.read;
		await req.listEntry.save();
	}
	res.json(req.listEntry);
});

module.exports = router;
