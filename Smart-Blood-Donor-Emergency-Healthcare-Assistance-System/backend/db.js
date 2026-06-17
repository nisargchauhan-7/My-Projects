const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Nish@1002",
    database: "sbdehas"
});

connection.connect((err) => {

    if (err) {
        console.log("Database Connection Failed");
        console.log(err);
    } else {
        console.log("Database Connected Successfully");
    }

});

module.exports = connection;