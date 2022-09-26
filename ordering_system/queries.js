var mysql = require('mysql');

var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "jack",
  database: "kellens_experiment",
  port: '3306',
});

con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM inventory", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });

