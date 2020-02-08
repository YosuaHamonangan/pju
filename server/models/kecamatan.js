module.exports = (sequelize, DataTypes) => {
	var kecamatan = sequelize.define("kecamatan", {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
	  	nama: {
			type: DataTypes.STRING,
			allowNull: false
	  	},
	  	idKota: {
			type: DataTypes.INTEGER,
			allowNull: false
	  	},
	}, {
		freezeTableName: true,
		timestamps: false
	});

	kecamatan.associate = models => {
		kecamatan.belongsTo(models.kota, {foreignKey: "idKota", as: "kota"});
		kecamatan.hasMany(models.kelurahan, {foreignKey: "idKecamatan"});
	}
	return kecamatan;
}
