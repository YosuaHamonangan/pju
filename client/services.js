import axios from "axios";
import Router from "next/router";
import store from "./store";

var instance = axios.create({
	// baseURL: BASE_URL
});

var services = {
	login: async function(username, password) {
		var res = await instance.post("/user/login", {username, password});
		var user = res.data;
		store.dispatch({ type: "SET_USER", user });
		return user;
	},
	logout: async function() {
		return await instance.post("/user/logout");
	},
	getUserList: async function() {
		var res = await instance.get("/user/list");
		return res.data;
	},
	registerUser: async function(data) {
		return await instance.post("/user/register", data);
	},
	getStatistics: async function() {
		var res = await instance.get("/pju/statistic");
		return res.data;
	},
	getPjuList: async function(filter) {
		var res = await instance.get("/pju/list", { 
			params: { ...filter }
		});
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