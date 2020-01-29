module.exports = (sequelize, DataTypes) => {
	var foto = sequelize.define("foto", {
		kodePju: {
			type: DataTypes.UUID,
		},
		originalName: {
			type: DataTypes.STRING,
		},
		path: {
			type: DataTypes.STRING,
			unique: true
		},
		mimetype: {
			type: DataTypes.STRING,
		},
	}, {
		freezeTableName: true,
	});

	foto.associate = models => {
		foto.belongsTo(models.pju, {foreignKey: "kodePju", as: "pju", targetKey: "kode"});
	}

	return foto;
};