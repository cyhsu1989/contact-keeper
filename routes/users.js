const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

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

			// 使用 bcryptjs hash 加密
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);

			await user.save();

			// 建立 payload 到 JWT
			// 這個 payload 是個物件，存著 user ID
			const payload = {
				user: {
					id: user.id
				}
			};

			// 簽署 JSON Web Token，有 4 個參數：payload、secret、object of options、callback
			jwt.sign(
				payload,
				config.get("jwtSecret"),
				{
					expiresIn: 360000
				},
				(err, token) => {
					// 有錯誤，就丟出錯誤
					if (err) throw err;
					// 成功，就回傳簽好的 token
					res.json({ token });
				}
			);
		} catch (error) {
			// 詳細的 error 資訊只給開發人員知道
			console.log(error.message);

			// 統一回傳狀態 500，及錯誤訊息
			res.status(500).send("Server error");
		}
	}
);

module.exports = router;
