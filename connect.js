var mysql = require('mysql');

var conn = mysql.createConnection({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE_NAME,
	multipleStatements: true
});

module.exports = conn;