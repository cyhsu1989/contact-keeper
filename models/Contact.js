const mongoose = require("mongoose");
const ContactSchema = mongoose.Schema({
	user: {
		// 用來判斷是哪一個 User
		type: mongoose.Schema.Types.ObjectId,
		// DB 中的 Collection
		ref: "users"
	},
	nema: {
		type: String,
		require: true
	},
	email: {
		type: String,
		require: true
	},
	phone: {
		type: String
	},
	type: {
		type: String,
		default: "personal"
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model("contact", ContactSchema);
