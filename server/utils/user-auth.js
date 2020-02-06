var passport = require("passport");
var LocalStrategy = require("passport-local");
var crypto = require("crypto");
var userRoles = require("../../global/constants/user-roles");
var User = db.models.user;

async function registerUser(data) {
	var { username, password } = data;
	var user = await User.findOne({ where: { username } });
	if(user) {
		throw Error("Username sudah digunakan");
	}
	
	var { salt, hash } = encryptPass(password);

	try {
		return await User.create({...data, salt, hash});
	}
	catch(err) {
		throw Error("Data tidak valid: " + err.errors[0].message);
	}
}

passport.use(new LocalStrategy(
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

function isAuthenticated(roles) {
	var checkRole = Array.isArray(roles);
	if(checkRole) {
		roles = roles.map( name => {
			var role = userRoles.find( r => r.name == name );
			return role.id;
		});
	}

	return function(req, res, next) {
		if(!req.isAuthenticated()) {
			return res.status(401).send({ message: "Unauthorized" });
		}

		if(checkRole && !roles.includes(req.user.role)) {
			return res.status(401).send({ message: "Unauthorized role" });
		}
		
		next();
	}
}

module.exports = {
	passport,
	isAuthenticated,
	registerUser
}