var fetch = require("isomorphic-fetch");
var Dropbox = require("dropbox").Dropbox;
var dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN, fetch });

// dbx.filesListFolder({path: ""})
//   .then(function(response) {
//     console.log(response);
//   })
//   .catch(function(error) {
//     console.log(error);
//   });

module.exports = {
	writeFile: function(path, contents) {
		return dbx.filesUpload({path, contents, mode: "overwrite"})
			.then( res => {} )
	},
	readFile: function(path) {
		return dbx.filesDownload({ path })
			.then( ({fileBinary}) => Promise.resolve(fileBinary) )
	}
}