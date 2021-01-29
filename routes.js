const cIndex = require("./controllers/cIndex");

module.exports = function(app) {
  app.get("/", cIndex.getInicio);
  app.get("/clientes/ajax/:agencia", cIndex.getClientesAjax);
  app.post("/clientes/agregarcliente", cIndex.addCliente);
  app.get("/clientes/getCliente/:id", cIndex.getClienteById);
  app.post("/clientes/modificarCliente", cIndex.postModificar);
  app.get("/clientes/eliminarCliente/:id", cIndex.eliminarCliente);
  app.get("/clientes/getClientesByAgencia/:agencia", cIndex.getClientesByAgencia);
  app.get("/clientes/getApuestas/:id", cIndex.redirectToApuestas);
  app.get("/clientes/getApuestasAjax/:id", cIndex.getApuestasByCliente);
  app.get("/clientes/eliminarApuesta/:id", cIndex.eliminarApuesta);
  app.get("/clientes/getApuestasPorFecha/:id/:desde/:hasta", cIndex.getApuestasByFecha);
  app.get("/clientes/modificarApuesta/:id", cIndex.getModificar);
  app.post("/clientes/postModificarApuesta", cIndex.postModificarApuesta);
  app.post("/clientes/postApuestas", cIndex.postApuestas);
};
