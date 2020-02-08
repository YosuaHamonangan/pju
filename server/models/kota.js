module.exports = (sequelize, DataTypes) => {
	var kota = sequelize.define("kota", {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
	  	nama: {
			type: DataTypes.STRING,
			allowNull: false
	  	},
	  	isKota: {
			type: DataTypes.BOOLEAN,
			allowNull: false
	  	},
	  	idProvinsi: {
			type: DataTypes.INTEGER,
			allowNull: false
	  	},
	}, {
		freezeTableName: true,
		timestamps: false
	});

	kota.associate = models => {
		kota.belongsTo(models.provinsi, {foreignKey: "idProvinsi", as: "provinsi"});
		kota.hasMany(models.kecamatan, {foreignKey: "idKota"});
	}
	return kota;
}
