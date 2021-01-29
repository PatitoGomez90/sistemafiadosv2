var conn = require('../config/db').conn;

module.exports = {
	getByQuery: getByQuery
}

function getByQuery(query, cb){
	conn(query, cb);
}