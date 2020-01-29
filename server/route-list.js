var list = [
	{
		path: '/',
		router: require('./routes/index')
	},
	{
		path: '/pju',
		router: require('./routes/pju')
	},
	{
		path: '/user',
		router: require('./routes/user')
	},
];

module.exports = list;