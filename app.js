var express = require("express");
var logfmt = require("logfmt");
var cons = require('consolidate');
var app = express();
var bodyParser = require("body-parser");
var routes = require('./routes');

var cookieParser = require('cookie-parser');
var methodoverride = require('method-override');

app.use(logfmt.requestLogger());
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname+'/views');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(methodoverride());
app.use(cookieParser('algodificil'));

app.use(express.static(__dirname+'/public'));

routes(app);

var port = Number(process.env.PORT || 3000);
app.listen(port, function() {
	console.log("Listening on " + port);
});