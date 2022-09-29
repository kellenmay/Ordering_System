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

module.exports = db.promise("SELECT SUM(invoice_item.quantity) as quantity , inventory.make as make, inventory.item_id FROM invoice_item INNER JOIN inventory ON invoice_item.item_id = inventory.item_id GROUP BY inventory.item_id")
  .then((result) => {
    console.log(JSON.parse(JSON.stringify(result)));
    const data = JSON.parse(JSON.stringify(result))
    return data
  })
  .catch((err) => {
    console.log(err);
  });


