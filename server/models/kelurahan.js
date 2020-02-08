module.exports = (sequelize, DataTypes) => {
	var kelurahan = sequelize.define("kelurahan", {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
	  	nama: {
			type: DataTypes.STRING,
			allowNull: false
	  	},
	  	idKecamatan: {
			type: DataTypes.INTEGER,
			allowNull: false
	  	},
	}, {
		freezeTableName: true,
		timestamps: false
	});

	kelurahan.associate = models => {
		kelurahan.belongsTo(models.kecamatan, {foreignKey: "idKecamatan", as: "kecamatan"})
	}
	return kelurahan;
}
