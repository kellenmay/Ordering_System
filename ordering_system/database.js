const mysql = require("mysql");

var db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "jack",
  database: "kellens_experiment",
  port: "3306",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Mysql: Connected");
});

db.promise = (sql) => {
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) {
        reject(new Error());
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = db