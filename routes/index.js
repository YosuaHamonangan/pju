var express = require('express');
var router = express.Router();
var { isAuthenticated } = require("../utils/user-auth");

router.get('/', function(req, res, next) {
	res.send("test")
});

router.get('/test-secret', isAuthenticated(), function(req, res, next) {
	res.send("Sukses");
});


module.exports = router;
