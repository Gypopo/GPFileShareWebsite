var mysql = require('mysql');

var con = mysql.createConnection({
  host: "172.17.0.1:3306/s7_test",
  user: "u7_eS5LyHJJxW",
  password: "iKbda=Jj8.no16sBB8xQja9D"
});

    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
      });

module.exports = function (sql) {
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result: " + result);
    return result;
  });
}