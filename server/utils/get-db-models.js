var fs = require("fs");
var path = require("path");

module.exports = function getDbModels(sequelize, modelsPath) {
	var models = {};
	fs.readdirSync(modelsPath).forEach( fileName => {
		var modelPath = path.join(modelsPath, fileName);
		var model = sequelize.import(modelPath);
		models[model.getTableName()] = model;
	});

	for(var name in models){
		if(typeof models[name].associate === "function"){
			models[name].associate(models);
		}
	}

	return models;
}