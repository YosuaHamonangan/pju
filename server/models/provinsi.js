module.exports = (sequelize, DataTypes) => {
	var provinsi = sequelize.define("provinsi", {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
	  	nama: {
			type: DataTypes.STRING,
			allowNull: false
	  	},
	}, {
		freezeTableName: true,
		timestamps: false
	});

	provinsi.associate = models => {
		provinsi.hasMany(models.kota, {foreignKey: "idProvinsi"});
	}

	return provinsi;
}
