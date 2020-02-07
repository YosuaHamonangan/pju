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

list.getById = id => list.find( role => role.id == id );

module.exports = list;