var list = [
	{
		id: 1,
		name: "admin",
		label: "Admin",
	},
	{
		id: 2,
		name: "lapangan",
		label: "Lapangan",
	},
	{
		id: 3,
		name: "tamu",
		label: "Tamu",
	},
];


var obj = {};
list.forEach( r => obj[r.id] = r );

list.getById = id => obj[id];

module.exports = list;