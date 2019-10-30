const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
	// 從 header 取得 Token
	const token = req.header("x-auth-token");

	// 檢查是否有 Token，如果沒有就回傳狀態碼：401 以及錯誤訊息
	if (!token) {
		return res.status(401).json({ msg: "No token, authorization denied" });
	}

	// 有 Token 的狀態下
	try {
		// 拿 token 與 default.json 中的 jwtSecret 做驗證解密，會得到一開始加密的元素及 payload，裡面有 user id
		const decode = jwt.verify(token, config.get("jwtSecret"));

		// 回傳這個 payload
		req.user = decode.user;
		// 通過，執行 route
		next();
	} catch (error) {
		res.status(401).json({ msg: "Token is not valid" });
	}
};
