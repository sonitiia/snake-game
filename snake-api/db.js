const Pool = require("pg").Pool;
const pool = new Pool({
	user: "postgres",
	password: "123fcK_",
	host: "localhost",
	port: 5432,
	database: "snakedb",
});

module.exports = pool;
