const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");

const User = require("../models/User");
const Contact = require("../models/Contact");

//@route    GET api/contacts
//@desc     Get all users contacts
//@access   Private
router.get("/", auth, async (req, res) => {
	try {
		// 利用該 user id 找到他本身的 contact 資料，以日期最近的排序
		const contacts = await Contact.find({ user: req.user.id }).sort({
			date: -1
		});
		res.json(contacts);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

//@route    POST api/contacts
//@desc     Add new contact
//@access   Private
router.post(
	"/",
	[
		auth,
		[
			check("name", "Name is required")
				.not()
				.isEmpty()
		]
	],
	async (req, res) => {
		// 驗證資料的格式正確性
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		// 解構從 reauest 來的資料
		const { name, email, phone, type } = req.body;

		// 建立一筆新的 contact 資料
		try {
			const newContact = new Contact({
				name,
				email,
				phone,
				type,
				user: req.user.id
			});

			// 將這筆新的 contact 資料存到 DB
			const contact = await newContact.save();
			// 回傳 contact 至 client 端
			res.json(contact);
		} catch (error) {
			console.error(error.message);
			res.status(500).send("Server Error");
		}
	}
);

//@route    PUT api/contacts/:id
//@desc     Update contact
//@access   Private
router.put("/:id", (req, res) => {
	res.send("Update contact");
});

//@route    DELETE api/contacts/:id
//@desc     Delete contact
//@access   Private
router.delete("/:id", (req, res) => {
	res.send("Delete contact");
});

module.exports = router;
