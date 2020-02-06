var express = require('express');
var router = express.Router();
var asyncRoute = require("../utils/async-route");
var { registerUser, isAuthenticated, passport } = require("../utils/user-auth");
var User = db.models.user;

router.post("/register", isAuthenticated(["admin"]), asyncRoute(async function(req, res, next) {
	try {
		var user = await registerUser(req.body);
		res.status(200).send("Registered");
	}
	catch(err) {
		res.status(400).send(err);
	}
}));

router.get('/list', isAuthenticated(["admin"]), asyncRoute(async function(req, res, next) {
	var list = await User.findAll();
	res.status(200).send(list);
}));

router.post("/login", function(req, res, next) {
	passport.authenticate("local", { session: false }, function(err, user, info) {
		if(err) return next(err);

		if(!user) {
			return res.status(404).send(info);
		}
		req.logIn(user, err => {
			if (err) return next(err);
			return res.status(200).send(user.getLimitedInfo());
		});
	})(req, res, next);
});

router.post("/logout", function(req, res, next) {
	req.logout();
	res.status(200).send("Logged out");
});

module.exports = router;
