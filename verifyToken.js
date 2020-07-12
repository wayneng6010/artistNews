const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
	const token = req.header("auth-token");
	if (!token) {
		console.log("Access Denied");
		return res.status(401).send("Access Denied");
	}
	try {
		const verified = jwt.verify(token, "$vE7YWqEuJQOXjlKxU7e4SOl");
        req.user = verified;
        next(); // continue to next middleware
	} catch (err) {
		console.log("Invalid token");
		return res.status(400).send("Invalid token");
	}
}
