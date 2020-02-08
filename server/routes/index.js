var express = require('express');
var router = express.Router();
var { isAuthenticated } = require("../utils/user-auth");

var Provinsi = db.models.provinsi;
var Kota = db.models.kota;
var Kecamatan = db.models.kecamatan;
var Kelurahan = db.models.kelurahan;

router.get('/test-secret', isAuthenticated(), function(req, res, next) {
	res.send("Sukses");
});

router.get('/get-provinsi', function(req, res, next) {
	Provinsi
		.findAll({
			attributes: [["id", "value"], ["nama", "label"]]
		})
		.then( list => res.send(list) )
		.catch( err => {
			console.error(err);
			res.status(400).end();
		});
});


router.get('/get-kota', function(req, res, next) {
	var {prov} = req.query;
	Kota
		.findAll({
			where: {idProvinsi: prov},
			attributes: [["id", "value"], ["nama", "label"]]
		})
		.then( list => res.send(list) )
		.catch( err => {
			console.error(err);
			res.status(400).end();
		});
});

router.get('/get-kecamatan', function(req, res, next) {
	var {kota} = req.query;
	Kecamatan
		.findAll({
			where: {idKota: kota},
			attributes: [["id", "value"], ["nama", "label"]]
		})
		.then( list => res.send(list) )
		.catch( err => {
			console.error(err);
			res.status(400).end();
		});
});

router.get('/get-kelurahan', function(req, res, next) {
	var {kecamatan} = req.query;
	Kelurahan
		.findAll({
			where: {idKecamatan: kecamatan},
			attributes: [["id", "value"], ["nama", "label"]]
		})
		.then( list => res.send(list) )
		.catch( err => {
			console.error(err);
			res.status(400).end();
		});
});

module.exports = router;
