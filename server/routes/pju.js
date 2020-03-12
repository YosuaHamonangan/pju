var express = require('express');
var router = express.Router();
var path = require("path");
var asyncRoute = require("../utils/async-route");
var { isAuthenticated } = require("../utils/user-auth");
var fs = require("../utils/fs-picker");
var createExcel = require("../utils/create-excel");
var { Sequelize: { Op }, sequelize} = db;
var Pju = db.models.pju;
var PjuHistory = db.models.pjuHistory;
var Foto = db.models.foto;

router.get('/get', isAuthenticated(), asyncRoute(async function(req, res, next) {
	var { kode } = req.query;
	var pju = await Pju.findOne({ where: { kode } });
	res.status(200).send(pju);
}));

router.get('/list', isAuthenticated(), asyncRoute(async function(req, res, next) {
	var { 
		legal, sections,
		longitudeMin, longitudeMax, latitudeMin, latitudeMax, 
		provinsi, kota, kecamatan, kelurahan
	} = req.query;

	var filter = {};

	if(legal === "true") {
		filter.idPelanggan = { [Op.ne]: null };
	}

	if(longitudeMin && longitudeMax && latitudeMin && latitudeMax) {
		filter.longitude = { [Op.between]: [+longitudeMin, +longitudeMax] };
		filter.latitude = { [Op.between]: [+latitudeMin, +latitudeMax] };
	}

	if(sections) {
		filter.section = sections.split(",");
	}

	if(provinsi) filter.idProvinsi = provinsi;
	if(kota) filter.idKota = kota;
	if(kecamatan) filter.idKecamatan = kecamatan;
	if(kelurahan) filter.idKelurahan = kelurahan;

	var list = await Pju.scope("include-association").findAll({ where: filter });
	res.status(200).send(list);
}));

router.get('/img', isAuthenticated(), asyncRoute(async function(req, res, next) {
	var { kode } = req.query;
	var pju = await Pju.findOne({ where: { kode }, include: ["foto"] });

	var { foto } = pju;
	var file = await fs.readFile(foto.path);
	res.setHeader('Content-Type', foto.mimetype);
	res.writeHead(200);
    res.end(file);
}));

router.get('/excel', isAuthenticated(), asyncRoute(async function(req, res, next) {
	var list = await Pju.scope("include-association").findAll();

	var header = [
		"Status", "ID Pelanggan", "Longitude", "Latitude", 
		"Provinsi", "Kota/Kabupaten", "Kecamatan", "Kelurahan/Desa",
		"Jalan", "RT", "RW", "Tipe Lampu", "Daya"
	];
	var data = list.map( row => {
		return [
			row.idPelanggan ? "legal" : "ilegal",
			row.idPelanggan || "",
			row.longitude,
			row.latitude,
			row.provinsi ? row.provinsi.nama : "",
			row.kota ? row.kota.nama : "",
			row.kecamatan ? row.kecamatan.nama : "",
			row.kelurahan ? row.kelurahan.nama : "",
			row.jalan || "",
			row.rt || "",
			row.rw || "",
			row.tipeLampu || "",
			row.daya,
		]
	});

	var filepath = createExcel("pju.xlsx", [header, ...data]);
	res.status(200).download(filepath, 'pju.xlsx');
}));

router.post('/create', isAuthenticated(), asyncRoute(async function(req, res, next) {
	var { user, body: data, files } = req;

	if(!(files && files.foto)) {
		res.status(400).send({ message : "Foto wajib diisi" });
		return;
	}

	// Save PJU info to db
	try {
		var pju = await Pju.create(data)
	}
	catch(err) {
		var message = "Data tidak valid";
		return res.status(400).send({ message });
	};
	
	// Save foto to fs and db
	var fotoFile = files.foto;
	var ext = path.extname(fotoFile.name);
	var foto = await Foto.create({
		kodePju: pju.kode,
		originalName: fotoFile.name,
	});
	var filepath = `/${foto.id}${ext}`;
	await foto.update({ path: filepath });
	await fs.writeFile(filepath, fotoFile.data);

	await PjuHistory.create({
		type: "CREATE",
		kodePju: pju.kode, 
		kodeUser: user.kode,
	});

	res.status(200).end();
}));

router.post('/edit', isAuthenticated(), asyncRoute(async function(req, res, next) {
	var { user, body, files } = req;
	var { kode, ...data } = body;

	var pju = await Pju.findOne({ where: { kode }, include: ["foto"] });

	if(files && files.foto) {
		var fotoFile = files.foto;
		var ext = path.extname(fotoFile.name);
		var { foto } = pju;
		var filepath = `/${foto.id}${ext}`;
		await foto.update({ path: filepath });
		await fs.writeFile(filepath, fotoFile.data);
	}

	try {
		pju.update(data);
	}
	catch(err) {
		var message = "Data tidak valid";
		return res.status(400).send({ message });
	};
	
	await PjuHistory.create({
		type: "UPDATE",
		kodePju: pju.kode, 
		kodeUser: user.kode,
	});

	res.status(200).send(pju);
}));

router.get('/statistic', isAuthenticated(), asyncRoute(async function(req, res, next) {
	var filterIllegal = { 
		where: { idPelanggan: null }
	};

	var data = {
		totalPju: await Pju.count(),
		totalPjuIlegal: await Pju.count(filterIllegal),
		totalDaya: await Pju.sum("daya"),
		totalDayaIlegal: await Pju.sum("daya", filterIllegal),
	}

	res.status(200).send(data);
}));

module.exports = router;
