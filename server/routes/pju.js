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

router.get('/list', isAuthenticated(), asyncRoute(async function(req, res, next) {
	var { legal } = req.query;
	var filter = {};

	if(legal === "true") {
		filter.idPelanggan = { [Op.ne]: null };
	}

	var list = await Pju.findAll({ where: filter });
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
	var list = await Pju.findAll();

	var columns = ["longitude", "latitude", "daya"];
	var data = list.map( row => columns.map( col => row[col] ) );

	var filepath = createExcel("pju.xlsx", [columns, ...data]);
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
		kodePju: pju.kode, 
		kodeUser: user.kode,
		type: "CREATE",
	});

	res.status(200).end();
}));

router.post('/update', isAuthenticated(["lapangan"]), asyncRoute(async function(req, res, next) {
	var { user, body: data, query: { kode } } = req;

	var pju = await Pju.findOne({ where: { kode } });
	if(!pju) {
		var message = `PJU dengan Kode "${kode}" tidak ditemukan`;
		res.status(400).send({ message });
		return;
	}

	var updatedKey = pju.set(data).changed();
	await pju.save();

	var detail = updatedKey ? `Update: ${updatedKey.join(", ")}` : "";
	await PjuHistory.create({
		kodePju: pju.kode, 
		kodeUser: user.kode,
		type: "UPDATE",
		detail
	});

	res.status(200).end();
}));

router.get('/statistic', isAuthenticated(), asyncRoute(async function(req, res, next) {
	var data = await Pju.findOne({
		attributes:[
			[sequelize.literal("SUM(idPelanggan IS NULL)"), "totalIlegal"],
			[sequelize.literal("SUM(idPelanggan IS NOT NULL)"), "totalLegal"],
			[sequelize.literal("SUM(daya)"), "totalDaya"],
		]
	});
	res.status(200).send(data);
}));

module.exports = router;
