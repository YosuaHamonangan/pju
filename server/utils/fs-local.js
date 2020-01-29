var fs = require("fs-extra");
var path = require("path");
var BASE_PATH = path.join(process.cwd(), "temp", "fs");
fs.ensureDir(BASE_PATH);

module.exports = {
	writeFile: function(filepath, contents) {
		filepath = path.join(BASE_PATH, filepath)
		return fs.writeFile(filepath, contents);
	},
	readFile: function(filepath) {
		filepath = path.join(BASE_PATH, filepath)
		return fs.readFile(filepath);
	}
}