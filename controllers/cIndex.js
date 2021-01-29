const mIndex = require("../models/mIndex.js");
const tools = require('../public/js/utils.js');
const async = require('async');
const mysql = require("mysql");

var connection = mysql.createConnection({
    user: 'root',
    password: '',
    host: '127.0.0.1',
    port: '3306',
    database: 'sistema_cobranza',
    dateStrings : true
});

module.exports = {
  getInicio: getInicio,
  getClientesAjax: getClientesAjax,
  addCliente: addCliente,
  getClienteById: getClienteById,
  postModificar: postModificar,
  eliminarCliente: eliminarCliente,
  getClientesByAgencia: getClientesByAgencia,
  redirectToApuestas: redirectToApuestas,
  getApuestasByCliente: getApuestasByCliente,
  eliminarApuesta: eliminarApuesta,
  getApuestasByFecha: getApuestasByFecha,
  getModificar: getModificar,
  postModificarApuesta: postModificarApuesta,
  postApuestas: postApuestas
};

function getInicio(req, res) {
  res.render("index", {
    pagename: "Sistema Fiados"
  });
}

function getClientesAjax(req, res) {
  var agencia = req.params.agencia;
  console.log("AGENCIA ", agencia);
  var query = "select clientes.*, ifnull(sum(a.jugo) - sum(a.pago), 0) as saldo, " +
      "ifnull(date_format(max(a.fecha), '%d/%m/%Y'), '') as fecha from clientes " +
      "left join apuestas a on id_apuesta = id_cliente ";
  if(agencia != 0) query += " where clientes.agencia = '"+agencia+"'";
  query += " group by clientes.id_cliente ";
  mIndex.getByQuery(query, function(clientes){
    query = "select ifnull(sum(jugo) - sum(pago), 0) as totalApuestas from apuestas";
    mIndex.getByQuery(query, apuestas => {
      res.send({ clientes, apuestas });
    });
  });

}

function getClientesByAgencia(req, res) {
  var agencia = req.params.agencia;
  var query =
    "select clientes.*, ifnull(sum(a.jugo) - sum(a.pago), 0) as saldo, " +
    "ifnull(date_format(max(a.fecha), '%d/%m/%Y'), '') as fecha from clientes left join apuestas a on id_apuesta = id_cliente " +
    "where clientes.agencia = '" +
    agencia +
    "' group by clientes.id_cliente";
  mIndex.getByQuery(query, clientes => {
    query = "select ifnull(sum(jugo) - sum(pago), 0) as totalApuestas from apuestas";
    mIndex.getByQuery(query, apuestas => {
      res.send({ clientes, apuestas });
    });
  });
}

function addCliente(req, res) {
  var c = req.body;
  var query =
    "insert into clientes (nombre, apellido, telefono, agencia) values ('" +
    c.nombre +
    "', '" +
    c.apellido +
    "', '" +
    c.telefono +
    "', '" +
    c.agencia +
    "')";
  mIndex.getByQuery(query, () => {
    res.send({ exito: "Cliente agregado exitosamente." });
  });
}

function getClienteById(req, res) {
  var id = req.params.id;
  var query = "select * from clientes where id_cliente = " + id;
  mIndex.getByQuery(query, cliente => {
    res.send(cliente);
  });
}

function postModificar(req, res) {
  var c = req.body;
  var query =
    "update clientes set nombre = '" +
    c.nombre +
    "', apellido = '" +
    c.apellido +
    "', telefono = '" +
    c.telefono +
    "', agencia = '" +
    c.agencia +
    "' where id_cliente = " +
    c.id;
  var query2 =
    "update apuestas set agencia = '" +
    c.agencia +
    "' where id_apuesta = " +
    c.id;
  mIndex.getByQuery(query, () => {
    mIndex.getByQuery(query2, () => {
      res.send({ exito: "Cliente modificado" });
    });
  });
}

function eliminarCliente(req, res) {
  var id = req.params.id;
  var query = "delete from clientes where id_cliente = " + id;
  var query2 = "delete from apuestas where id_apuesta = " + id;
  mIndex.getByQuery(query, () => {
    mIndex.getByQuery(query2, () => {
      res.send({ exito: "Cliente eliminado" });
    });
  });
}

function redirectToApuestas(req, res) {
  var id = req.params.id;
  res.render("apuestas", {
    pagename: "Apuestas del Cliente: ",
    id_cliente: id
  });
}

function getApuestasByCliente(req, res) {
  var id = req.params.id;
  var query = "select * from clientes where id_cliente = " + id;
  var query2 =
    "select *, date_format(fecha, '%d/%m/%Y') as fecha_txt from apuestas where id_apuesta = " + id + " order by fecha desc";
  mIndex.getByQuery(query, cliente => {
    mIndex.getByQuery(query2, apuestas => {
        res.send({
          cliente: cliente,
          apuestas: apuestas
      });
    });
  });
}

function eliminarApuesta(req, res){
  var id = req.params.id;
  var query = "delete from apuestas where id_ap = " + id;
  mIndex.getByQuery(query, function(){
    res.send({exito: 'OK'})
  });
}

function getApuestasByFecha(req, res){
  var id = req.params.id;
  var desde = tools.changeDate(req.params.desde);
  var hasta = tools.changeDate(req.params.hasta);
  var query = "select *, date_format(fecha, '%d/%m/%Y') as fecha_txt from apuestas where id_apuesta = "+id+" and "+
  "fecha BETWEEN '"+desde+"' AND '"+hasta+"' order by fecha desc";
  mIndex.getByQuery(query, function(apuestas){
    query = "select ifnull(sum(jugo)-sum(pago), 0) as saldo from apuestas where id_apuesta = "+id+" and fecha < '"+desde+"'";
    mIndex.getByQuery(query, function(saldoanterior){
      query = "select sum(jugo)-sum(pago) as saldototal from apuestas where id_apuesta = "+id;
      mIndex.getByQuery(query, function(saldototal){
        res.send({
          apuestas: apuestas,
          saldoanterior: saldoanterior,
          saldototal: saldototal
        });        
      })
    })
  })
}

function getModificar(req, res){
  var id = req.params.id;
  var query = "select *, date_format(fecha, '%d/%m/%Y') as fecha_txt from apuestas where id_ap = "+id;
  mIndex.getByQuery(query, function(apuesta){
    res.send(apuesta);
  });
}

function postModificarApuesta(req, res){
  var id_apuesta = req.body.id_apuesta;
  var jugo = req.body.jugo;
  var pago = req.body.pago;
  var fecha = tools.changeDate(req.body.fecha);
  var query = "update apuestas set jugo = "+jugo+", pago = "+pago+", fecha = '"+fecha+"' where id_ap = "+id_apuesta;
  mIndex.getByQuery(query, function(){
    res.send({exito: "OK"});
  });
}

function postApuestas(req, res){
  console.log(req.body.apuestas);
  async.eachSeries(req.body.apuestas, function (item, callback) {
    if(item.jugo == "") item.jugo = 0;
    if(item.pago == "") item.pago = 0;
    item.fecha = tools.changeDate(item.fecha);
    query = "insert into apuestas (id_apuesta, agencia, fecha, jugo, pago) values ("+item.id+", '"+item.agencia+"', '"+item.fecha+"', "+item.jugo+", "+item.pago+")";
    console.log(query)
    connection.query(query, function(err, rows, fields) {
      if (!err){
        callback();
      }else{
        console.log(err)
        res.send({error: 'hubo un error'});
      }
    });
  }, function (err) {
      if (err) {
          res.send({error: 'Hubo un error'});
      }else{
        console.log('apuestas finish');
        res.send({exito: 'termine de insertar las apuestas'});
      }
  });
}


