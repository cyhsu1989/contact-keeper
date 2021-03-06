const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/auth");
const User = require("../models/User");

//@route    GET api/auth
//@desc     Get logged in user
//@access   Private
router.get("/", auth, async (req, res) => {
	try {
		// 拿著透過 middleware 才解析出來的 user id，在 DB 中找到該 user 相關資料，但不要回傳 password
		const user = await User.findById(req.user.id).select("-password");
		// 回傳 user 資料
		res.json(user);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server error");
	}
});

//@route    POST api/auth
//@desc     Auth user & get token
//@access   Public
router.post(
	"/",
	[
		check("email", "Please include a valid email").isEmail(),
		check("password", "Password is required").exists()
	],
	async (req, res) => {
		// 驗證兩個資料的格式正確性
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password } = req.body;

		try {
			// 這個 request 的 email，檢查是否有在 DB 中找到
			let user = await User.findOne({ email });
			if (!user) {
				return res.status(400).json({ msg: "Invalid Crendentials" });
			}

			// request 中的 password 與 DB 中的 password 比較
			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.status(400).json({ msg: "Invalid Crendentials" });
			}

			// 建立並回傳 Token 流程
			const payload = {
				user: {
					id: user.id
				}
			};

			jwt.sign(
				payload,
				config.get("jwtSecret"),
				{
					expiresIn: 360000
				},
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
		} catch (error) {
			console.error(error.message);
			res.status(500).send("Server error");
		}
	}
);

module.exports = router;
