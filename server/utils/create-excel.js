var XLSX = require("xlsx");
var fs = require("fs-extra");
var path = require("path");
var BASE_PATH = path.join(process.cwd(), "temp", "excel");
fs.ensureDir(BASE_PATH);

function createExcel(filename, data) {
	var ws = XLSX.utils.aoa_to_sheet(data);
	var wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, "SheetJS");

	var filepath = path.join(BASE_PATH, filename);
	XLSX.writeFile(wb, filepath);
	return filepath;
}

module.exports = createExcel;