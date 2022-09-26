const database = require('./database');

const con = database.con

console.log(con.RowDataPacket[0])