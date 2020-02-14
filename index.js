#!/usr/bin/env node
require("dotenv").config();

var next = require("next");
var withCSS = require("@zeit/next-css")
var dev = process.env.NODE_ENV !== "production";
var dir = "./client";
var app = next({ dir, dev });
var handle = app.getRequestHandler();
var port = normalizePort(process.env.PORT || '3000');
var passport = require("passport");

(async function() {
	global.db = await require("./server/db");

	await app.prepare();
	
	var server = require('./server/app');

	server.all("*", (req, res, next) => {
		if(req.url.startsWith("/_next")|| req.url === "/login"){
			return handle(req, res);
		}

		passport.authenticate("jwt", { session: false }, function(err, user, info){
			if(user) {
				req.user = user;
				handle(req, res);
			}
			else res.redirect("/login");
		})(req, res, next);
	});

	server.listen(port, err => {
		if (err) throw err;
		console.log(`> Ready on http://localhost:${port}`);
	});
})();

function normalizePort(val) {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		return val;
	}

	if (port >= 0) {
		return port;
	}

	return false;
}