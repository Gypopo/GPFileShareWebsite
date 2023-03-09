import mysql from 'mysql';

export class MySQL {
  constructor() {
    this.con = mysql.createConnection({
      host: "172.17.0.1",
      port: '3306',
      database: 's8_test',
      user: "u8_JfVyUwYyCr",
      password: "hH!bP9qe.ZAc!kZd0zeo!B!8"
    });

    this.con.connect(function(err) {
      if (err) throw err;
        console.log("Database connected");
      });

      this.createTables();
  }

  query(sql) {
    this.con.query(sql, function (err, result, results) {
    if (err) throw err;
    console.log("Result: " + result + " - " + results);
    return result;
    })
  };

  createTables() {
    var cards = 'CREATE TABLE IF NOT EXISTS cards(' +
              'id VARCHAR(50) NOT NULL,' +
              'author VARCHAR(25) DEFAULT "Anonymous",' +
              'description VARCHAR(255),' +
              'createDate FLOAT DEFAULT ' + new Date().getMilliseconds() + ',' + 
              'tags VARCHAR(255) NOT NULL,' +
              'plVer DOUBLE NOT NULL,' +
              'mcVer DOUBLE NOT NULL);';
    try {
      this.query(cards);
    } catch (e) {
      console.error('Failed to create tables ' + e);
    }
  }
}