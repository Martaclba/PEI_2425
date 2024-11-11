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


/*    GET sales    */ 
// Route responsible for retrieving the dashboard's data for each kind of user.
// Should return a json structured variable with: 
  // the total of sales for each delegate and year as well as the total of sales for every delegate; 
  // the total of sales by product for each delegate,  year (divided in months) and company as well as the tota of sales for every delegate
  // the total of sales by brick for each delegate and year (divided in months) as well as the tota of sales for every delegate
router.get('/', function(req, res, next) { Queries.getSale(db, res, req) });

/*    POST sales   */
// Route responsible for sending the hmr file to the database
router.post('/', function(req, res, next) { Queries.createDelegate(db, res, req) });


/*    GET delegate by id   */
// Route responsible for retrieving a delegate's details
// Should return a json structured variable with relevant information
router.get('/delegados/:id', function(req, res, next) { Queries.getDelegates(db, parseInt(req.params.id), res, req) });

/*    PUT delegate by id   */
// Route responsible for updating a delegate's details
router.put('/delegados/:id', function(req, res, next) { Queries.getDelegates(db, parseInt(req.params.id), res, req) });


/*    GET delegates   */
// Route responsible for retrieving the delegates
// Should return a json structured variable withe relevant information
router.get('/delegados', function(req, res, next) { Queries.getDelegates(db, res, req) });

/*    POST delegates    */
// Route responsible for registering a delegate
// Should receive a dictionary with the following:
  // First and Last name (Primeiro; Ultimo)
  // Distrito
  // Regiao
  // Freguesia
  // Estado
router.post('/delegados/registar', function(req, res, next) { Queries.createDelegate(db, res, req) });


/*    Get form's data    */
// Route responsible for retrieving the form's data for the admin
// Should return a json structured variable with:
  // the instituitions
  // the specialties
  // the districts
  // the regions
  // the towns
  // the products (?)
  router.get('/forms', function(req, res, next) { Queries.getSale(db, res, req) });


/* GET home page. */ // test queries
//router.get('/towns', function(req, res, next) { Queries.getTowns(db, res, req) });

module.exports = router;