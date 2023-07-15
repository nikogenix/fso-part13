const Blog = require("./blog");
const User = require("./user");
const ReadingList = require("./reading_list");
const Session = require("./session");

Blog.belongsTo(User, { as: "user" });
User.hasMany(Blog, { as: "blogs_added" });

Blog.belongsToMany(User, { as: "user_likes", through: ReadingList });
User.belongsToMany(Blog, { as: "reading_list", through: ReadingList });

User.hasOne(Session);
Session.belongsTo(User);

module.exports = {
	Blog,
	User,
	ReadingList,
};
