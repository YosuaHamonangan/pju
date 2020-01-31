import axios from "axios";
import Router from "next/router";

var instance = axios.create({
	// baseURL: BASE_URL
});

var services = {
	login: async function(username, password) {
		return await instance.post("/user/login", {username, password});
	},
	getStatistics: async function() {
		var res = await instance.get("/pju/statistic");
		return res.data;
	},
	errorHandler: function(err) {
		if(!err.response) {
			return "Gagal terhubung dengan server, mohon cek koneksi anda";
		}
		else if(err.response.status === 401) {
			Router.push("/login");
		}
		else {
			var { data = {} } = err.response;
			var { message = "Terjadi masalah, mohon hubungi admin" } =  data;

			return message;
		}
	},
};

export default services;