var express = require('express');

const { Pool } = require('pg')

DB_USER = "mypharma"
DB_PASSWORD = "mypharma"
DB_HOST = "localhost"
DB_PORT = 5432
DB_NAME = "mypharma"
 
const db = new Pool({
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
})
db.connect((err) => {
  if (err) {
    console.error('PostgreSQL connection error...', err.stack);
  } else {
    console.log('Conexão ao PostgreSQL realizada com sucesso');
  }
});

var router = express.Router();
var Queries = require('./queries')


/* GET sales. */
router.get('/', function(req, res, next) { Queries.getSale(db, res, req) });

/* POST sales. */
router.post('/', function(req, res, next) { Queries.createDelegate(db, res, req) });

/* GET delegates by id. */
router.get('/delegados/:id', function(req, res, next) { Queries.getDelegates(db, parseInt(req.params.id), res, req) });

/* PUT delegate by id. */
router.put('/delegados/:id', function(req, res, next) { Queries.getDelegates(db, parseInt(req.params.id), res, req) });

/* GET delegates. */
router.get('/delegados', function(req, res, next) { Queries.getDelegates(db, res, req) });

/* POST delegates. */
router.post('/delegados', function(req, res, next) { Queries.createDelegate(db, res, req) });

/* GET home page. */ // test queries
//router.get('/towns', function(req, res, next) { Queries.getTowns(db, res, req) });

module.exports = router;