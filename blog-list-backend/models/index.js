const Blog = require("./blog");
const User = require("./user");
const ReadingList = require("./reading_list");

Blog.belongsTo(User, { as: "added_by" });
User.hasMany(Blog, { as: "blogs_added" });

Blog.belongsToMany(User, { as: "user_likes", through: ReadingList });
User.belongsToMany(Blog, { as: "reading_list", through: ReadingList });

module.exports = {
	Blog,
	User,
	ReadingList,
};
