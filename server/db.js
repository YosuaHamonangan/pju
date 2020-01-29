var path = require("path");
var Sequelize = require("sequelize");
var getDbModels = require("./utils/get-db-models");

if(process.env.SQL) {
	var { host, database, username, password, port } = JSON.parse(process.env.SQL);

	var sequelize = new Sequelize(database, username, password, {
		host: host || "localhost",
		dialect: "mysql",
		port,
		logging: false
	});
}
else if (process.env.DATABASE_URL) {
	var match = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);

	var sequelize = new Sequelize(match[5], match[1], match[2], {
		dialect: "postgres",
		protocol: "postgres",
		port: match[4],
		host: match[3],
		logging: false
	});
}
else{
	var sequelize = new Sequelize("database", "username", "password", {
		host: "localhost",
		dialect: "sqlite",
		storage: "PJUManagement.db",
		logging: false
	});
}

var modelsPath = path.join(process.cwd(), "server", "models");
var models = getDbModels(sequelize, modelsPath);

var promise = sequelize.sync()
	.then( () => sequelize.authenticate())
	.then( () => {
		console.log("Database connection has been established successfully.");
		return Promise.resolve({ Sequelize, sequelize, models });
	});

module.exports = promise;