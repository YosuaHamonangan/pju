module.exports = (sequelize, DataTypes) => {
	var user = sequelize.define("user", {
		kode: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV1,
			allowNull: false,
			unique: true
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
			validate: {
				isEmail: true,
			}
		},
		role: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		salt: {
			type: DataTypes.STRING,
			allowNull: false
		},
		hash: {
			type: DataTypes.TEXT,
			allowNull: false
		},
	}, {
		freezeTableName: true,
	});

	user.associate = models => {
		
	}

	user.prototype.getLimitedInfo = function() {
		var info = {};
		["kode", "username", "name", "email", "role"]
			.forEach( prop => info[prop] = this[prop] );

		return info;
	}

	return user;
}
