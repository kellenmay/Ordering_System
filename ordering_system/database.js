const mysql = require("mysql");

var db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "jack",
  database: "kellens_experiment",
  port: "3306",
});

// var loggedData = null;

// db.connect(function(err) {
//   if (err) throw err;
//   db.query("SELECT * FROM inventory", function (err, result, fields) {
//     if (err) {
//       throw err;
//     } else {
//     const data = JSON.parse(JSON.stringify(result))
//     loggedData = data
//     console.log(data)
//     }
//   })
// });

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

db.promise("SELECT * FROM inventory")
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });

// setTimeout(function () {
//   console.log(loggedData);
// }, 2000);

module.exports = {
  db: db,
};
