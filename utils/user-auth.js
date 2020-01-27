var passport = require("passport");
var LocalStrategy = require("passport-local");
var crypto = require("crypto");
var User = db.models.user;

passport.use("local-register", new LocalStrategy(
	{
		usernameField: "username",
		passwordField: "password",
		passReqToCallback: true
	},
	async (req, username, password, done) => {
		try{
			var user = await User.findOne({ where: { username} });
			if(user) {
				return done(null, false, { message: "Username sudah digunakan" });
			}
			
			var { body } = req;
			var { salt, hash } = encryptPass(password);
			user = await User.create({...body, role: 1, salt, hash})
				.catch( () => {
					done(null, false, { message: "Data tidak valid" });
				});

			if(user){
				return done(null, user);
			}
		}
		catch(err){
			done(err);
		}
	}
));

passport.use("local-login", new LocalStrategy(
	{
		usernameField: "username",
		passwordField: "password",
	}, 
	async (username, password, done) => {
		try{
			var user = await User.findOne({ where: { username} });
			if(!user || !validate(user, password)) {
				return done(null, false, { message: "Username atau Password tidak valid" });
			}
			return done(null, user);
		}
		catch(err){
			done(err);
		}
	}
));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findByPk(id)
		.then( user => {
			done(null, user);
		})
		.catch(done);
});

function validate(user, password) {
	var hash = crypto.pbkdf2Sync(password, user.salt, 10000, 512, "sha512").toString("hex");
	return user.hash === hash;
};

function encryptPass(password) {
	var salt = crypto.randomBytes(16).toString("hex");
	var hash = crypto.pbkdf2Sync(password, salt, 10000, 512, "sha512").toString("hex");
	return { salt, hash };
}

function isAuthenticated(){
	return function(req, res, next){
		if(req.isAuthenticated()) {
			next();
		}
		else {
			return res.status(401).send("unauthorized");
		}
	}
}

module.exports = {
	passport,
	isAuthenticated
}