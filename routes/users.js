const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

//@route    POST api/users
//@desc     Register a user
//@access   Public
router.post(
	"/",
	[
		check("name", "Please add name")
			.not()
			.isEmpty(),
		check("email", "Please include a valid email").isEmail(),
		check(
			"password",
			"Please enter a password with 6 or more characters"
		).isLength({ min: 6 })
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, password } = req.body;

		try {
			// 檢查 user 是否已經存在
			let user = await User.findOne({ email });
			// 若存在，則回傳 status 400 及錯誤訊息
			if (user) {
				return res.status(400).json({ msg: "User already exists" });
			}

			// 使用 User model 去建立新的 user
			user = new User({
				name,
				email,
				password
			});

			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);

			await user.save();

			res.send("User saved");
		} catch (error) {
			console.log(error.message);
			res.status(500).send("Server error");
		}
	}
);

module.exports = router;
