#!/usr/bin/env node
var next = require("next");
var dev = process.env.NODE_ENV !== "production";
var dir = "./client";
var app = next({ dir, dev });
var handle = app.getRequestHandler();
var port = normalizePort(process.env.PORT || '3000');

(async function() {
	global.db = await require("./server/db");

	await app.prepare();
	
	var server = require('./server/app');

	server.all("*", (req, res) => {
		if(!req.url.startsWith("/_next") && req.url !== '/login' && !req.isAuthenticated()){
			return res.redirect("/login");
		}
		return handle(req, res);
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