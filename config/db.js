var mysql = require('mysql');

const connection = mysql.createConnection({
  user: "root",
  password: "",
  host: "localhost",
  port: "3306",
  database: "sistema_cobranza",
  dateStrings: true
});

function conn(query, cb){
    /*var connection = mysql.createConnection({
        user: 'root',
        password: '',
        host: '127.0.0.1',
        port: '3306',
        database: 'sistema_cobranza',
        dateStrings : true
    });*/

    console.log('/--------/ DEBUG USE /---------/');
    console.log(query);
    /*connection.connect();*/
   
    connection.query(query, function(err, rows, fields) {
        if (err) {
	        console.log("ERROR DE BASE DE DATOS");
	        connection.end();
	        throw err;
	    } else {
	        cb(rows);
	    }
	});
}

function _conn(sql, params, cb){
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        user: 'root',
        password: '',
        host: '127.0.0.1',
        port: '3306',
        database: 'sistema_cobranza',
        dateStrings : true
    });

    console.log('/--------/ DEBUG USE /---------/');
    console.log(sql);
    console.log("params: "+params);
    connection.connect();
    var q = connection.query(sql, params ,function(err, rows, fields) {
        if (err) throw err;
        connection.end();
        cb(rows);
    });
    console.log(q.sql);
}

exports.conn = conn;
exports._conn = _conn;