var mapUtils = require("../../global/utils/map");

module.exports = (sequelize, DataTypes) => {
	var pju = sequelize.define("pju", {
		kode: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV1,
			allowNull: false,
			unique: true
		},
		idPelanggan: {
			type: DataTypes.STRING,
		},
		idFoto: {
			type: DataTypes.INTEGER,
		},
		tipeLampu: {
			type: DataTypes.STRING,
		},
		daya: {
            type: DataTypes.FLOAT,
			allowNull: false,
		},
		longitude: {
			type: DataTypes.DECIMAL(9, 6),
			allowNull: false,
		},
		latitude: {
			type: DataTypes.DECIMAL(9, 6),
			allowNull: false,
		},
		jalan: {
			type: DataTypes.STRING,
		},
		idProvinsi: {
			type: DataTypes.INTEGER,
		},
		// Kota/Kabupaten
		idKota: {
			type: DataTypes.INTEGER,
		},
		idKecamatan: {
			type: DataTypes.INTEGER,
		},
		// Kelurahan/Desa
		idKelurahan: {
			type: DataTypes.INTEGER,
		},
		rw: {
			type: DataTypes.STRING,
		},
		rt: {
			type: DataTypes.STRING,
		},
		section: {
			type: DataTypes.STRING,
		}
	}, {
		freezeTableName: true,
		timestamps: false,
		hooks: {
			beforeCreate: (pju, options) => {
				pju.section = mapUtils.getSection(pju.longitude, pju.latitude);
			},
			beforeUpdate: (pju, options) => {
				pju.section = mapUtils.getSection(pju.longitude, pju.latitude);
			},
		}
	});

	pju.associate = models => {
		pju.hasMany(models.pjuHistory, {foreignKey: "kodePju", sourceKey: "kode"});
		pju.hasOne(models.foto, {foreignKey: "id", as: "foto"});

		pju.belongsTo(models.provinsi, {foreignKey: "idProvinsi", as: "provinsi"});
		pju.belongsTo(models.kota, {foreignKey: "idKota", as: "kota"});
		pju.belongsTo(models.kecamatan, {foreignKey: "idKecamatan", as: "kecamatan"});
		pju.belongsTo(models.kelurahan, {foreignKey: "idKelurahan", as: "kelurahan"});
	}
	return pju;
};
