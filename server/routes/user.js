var express = require('express');
var router = express.Router();
var { passport } = require("../utils/user-auth");

router.post("/register", passport.authenticate("local-register"));

router.post("/login", function(req, res, next) {
	passport.authenticate("local-login", function(err, user, info) {
		if(err) return next(err);

		if(!user) {
			return res.status(404).send(info);
		}
		req.logIn(user, err => {
			if (err) return next(err);
			return res.status(200).send("Logged in");
		});
	})(req, res, next);
});

router.post("/logout", function(req, res, next) {
	req.logout();
	res.status(200).send("Logged out");
});

module.exports = router;
