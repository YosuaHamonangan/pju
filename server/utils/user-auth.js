var passport = require("passport");
var LocalStrategy = require("passport-local");
var crypto = require("crypto");
var passportJWT = require("passport-jwt");
var JWTStrategy = passportJWT.Strategy;
var ExtractJWT = passportJWT.ExtractJwt;
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

async function changePassword(user, currentPassword, password) {
	if(!validate(user, currentPassword)) {
		throw Error("Password yang lama tidak sesuai");
	}

	var { salt, hash } = encryptPass(password);
	return await user.update({ salt, hash });
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

passport.use(new JWTStrategy(
	{
		jwtFromRequest: function(req) {
			var token = null;
			if(req && req.cookies) {
				token = req.cookies['token'];
			}
			return token;
		},
		secretOrKey: process.env.SECRET
	}, 
	async (payload, done) => {
		try{
			var user = await User.findByPk(payload.id);
			if(!user) {
				return done(null, false, { message: "Token tidak valid" });
			}
			return done(null, user)
		}
		catch(err) {
			return done(err, false, { message: "Token tidak sesuai" });
		}
	}
))


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
		passport.authenticate("jwt", { session: false }, function(err, user, info){
			if(!user) {
				return res.status(401).send({ message: "Unauthorized" });
			}

			if(checkRole && !roles.includes(user.role)) {
				return res.status(401).send({ message: "Unauthorized role" });
			}
			
			next();
		})(req, res, next);
	}
}

module.exports = {
	passport,
	isAuthenticated,
	registerUser,
	changePassword
}