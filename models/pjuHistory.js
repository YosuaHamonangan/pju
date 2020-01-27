module.exports = (sequelize, DataTypes) => {
	var pjuHistory = sequelize.define("pjuHistory", {
		kodePju: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		kodeUser: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		type: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		detail: {
			type: DataTypes.TEXT,
		}
	}, {
		freezeTableName: true,
	});

	pjuHistory.associate = models => {
		pjuHistory.belongsTo(models.pju, {foreignKey: "kodePju", as: "pju", targetKey: "kode"});
		pjuHistory.belongsTo(models.user, {foreignKey: "kodeUser", as: "user", targetKey: "kode"});
	}

	return pjuHistory;
}
