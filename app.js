require("dotenv").config();

global.db = require("./db");
var express = require("express");
var logger = require("morgan");
var session = require('express-session');
var passport = require("passport");
var auth = require("./utils/user-auth");
var cookieParser = require("cookie-parser");
var fileUpload = require("express-fileupload");

var app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({ 
	secret: process.env.SECRET, 
	// cookie: { maxAge: 60*1000 },
	resave: false, 
	saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(fileUpload());

var routeList = require("./route-list");
routeList.forEach( ({path, router}) => app.use(path, router) );

app.use(function(req, res, next) {
	res.status(404).end({ message: "API tidak ditemukan" });
});

app.use(function(err, req, res, next) {
	console.error(err);
	res.status(500).end({ message: "Terjadi masalah dengan server, dimohon untuk menghubungi admin" });
});


module.exports = app;
