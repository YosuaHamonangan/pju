var express = require('express');
var router = express.Router();
var asyncRoute = require("../utils/async-route");
var { registerUser, changePassword, isAuthenticated, passport } = require("../utils/user-auth");
var jwt = require("jsonwebtoken");
var User = db.models.user;

// router.post("/register", isAuthenticated(["admin"]), asyncRoute(async function(req, res, next) {
router.post("/register", asyncRoute(async function(req, res, next) {
	try {
		var user = await registerUser(req.body);
		res.status(200).send("Registered");
	}
	catch(err) {
		var { message } = err;
		res.status(400).send({ message });
	}
}));

router.post("/password", isAuthenticated(["admin"]), asyncRoute(async function(req, res, next) {
	var { kode, currentPassword, password } = req.body;
	var user = await User.findOne({ where: { kode } });

	if(!user) {
		var message = "User tidak ditemukan";
		res.status(400).send({ message });
	}

	try {
		var user = await changePassword(user, currentPassword, password);
		res.status(200).send("Changed");
	}
	catch(err) {
		var { message } = err;
		res.status(400).send({ message });
	}
}));

router.post("/update", isAuthenticated(["admin"]), asyncRoute(async function(req, res, next) {
	var { kode, data } = req.body;
	var user = await User.findOne({ where: { kode } });

	if(!user) {
		var message = "User tidak ditemukan";
		res.status(400).send({ message });
	}
	await user.update(data);
	res.status(200).send(user.getLimitedInfo());
}));

router.get('/get', isAuthenticated(["admin"]), asyncRoute(async function(req, res, next) {
	var { kode } = req.query;
	var user = await User.scope("limitedInfo").findOne({ where: { kode } });
	res.status(200).send(user);
}));

router.get('/list', isAuthenticated(["admin"]), asyncRoute(async function(req, res, next) {
	var list = await User.scope("limitedInfo").findAll();
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

			var token = jwt.sign({ id: user.id }, process.env.SECRET);
			res.cookie("token", token, { httpOnly: true });
			return res.status(200).send({ user: user.getLimitedInfo() });
		});
	})(req, res, next);
});

router.post("/logout", function(req, res, next) {
	req.logout();
	res.cookie("token", null, { httpOnly: true });
	res.status(200).send("Logged out");
});

module.exports = router;
