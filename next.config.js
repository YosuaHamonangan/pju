require("dotenv").config();
const withCSS = require('@zeit/next-css')

module.exports = {
	...withCSS(),
	env: {
		MAP_API_KEY: process.env.MAP_API_KEY,
	},
};
