if(process.env.DROPBOX_ACCESS_TOKEN) {
	module.exports = require("./fs-dropbox");
}
else {
	module.exports = require("./fs-local");
}