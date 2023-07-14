const Blog = require("./blog");
const User = require("./user");
const ReadingList = require("./reading_list");

Blog.belongsTo(User);
User.hasMany(Blog);

Blog.belongsToMany(User, { through: ReadingList });
User.belongsToMany(Blog, { through: ReadingList });

module.exports = {
	Blog,
	User,
	ReadingList,
};
