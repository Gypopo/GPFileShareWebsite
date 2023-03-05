import {mysql} from "./node_modules/mysql/index.js";

var con = mysql.createConnection({
  host: "172.17.0.1:3306/s7_test",
  user: "u7_eS5LyHJJxW",
  password: "iKbda=Jj8.no16sBB8xQja9D"
});

export function connect() {
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
      });
}

con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result: " + result);
  });