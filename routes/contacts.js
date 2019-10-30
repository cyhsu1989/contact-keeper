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
router.put("/:id", auth, async (req, res) => {
	const { name, email, phone, type } = req.body;

	// 建立 contact 物件
	const contactFields = {};
	if (name) contactFields.name = name;
	if (email) contactFields.email = email;
	if (phone) contactFields.phone = phone;
	if (type) contactFields.type = type;

	try {
		// 根據 request 帶過來的 id，使用 findById(req.param.id) 找到該筆 contact
		let contact = await Contact.findById(req.params.id);

		// 判斷該筆資料有沒有找到
		if (!contact) return res.status(404).json({ msg: "Contact not found" });

		// 確認是否為 user 本身的 contact 資料
		// contact.user: 該筆 contact 資料是屬於哪個 user id
		// req.user.id: 是 middleware/auth.js 認證 token 後回傳的 user id
		if (contact.user.toString() !== req.user.id) {
			// 如果不是同個使用者，回傳狀態碼: 401 及訊息
			return res.status(401).json({ msg: "Not authorized" });
		}

		// 透過 request 帶過來的 id，找到該筆 contact 資料，使用 findByIdAndUpdate() 更新
		// 先前建立的 contactFields 物件，帶入更新
		contact = await Contact.findByIdAndUpdate(
			req.params.id,
			{ $set: contactFields },
			{ new: true } // new: true 表示如果沒有找到該筆資料，那就新增這筆
		);

		// 回傳更新後的 contact 資料
		res.json(contact);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

//@route    DELETE api/contacts/:id
//@desc     Delete contact
//@access   Private
router.delete("/:id", auth, async (req, res) => {
	try {
		let contact = await Contact.findById(req.params.id);

		if (!contact) return res.status(404).json({ msg: "Contact not found" });

		if (contact.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: "Not authorized" });
		}

		await Contact.findByIdAndRemove(req.params.id);

		res.json({ msg: "Contact removed" });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

module.exports = router;
