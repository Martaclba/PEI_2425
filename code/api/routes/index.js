var express = require('express');

var router = express.Router();
var Queries = require('./queries')

// options = {
//   option_selected: { year: '2024', delegate: 'Todos' }              (example)
//   type: (histogram/products/totalProducts/bricks)                   (to know what to put on "data")
//   delegates: (true/false)                                            -> irrelevante
//   years: (true/false)                                                -> irrelevante
//   companies: (true/false)                                            -> irrelevante
//   bricks: (true/false)                                               -> irrelevante
//   products: (true/false)                                             -> irrelevante
// }


/*    GET sales    */ 
// Route responsible for retrieving the dashboard's data for each kind of user.
// Should return a json structured variable with: 
  // the total of sales for each delegate and year as well as the total of sales for every delegate; 
  // the total of sales by product for each delegate,  year (divided in months) and company as well as the tota of sales for every delegate
  // the total of sales by brick for each delegate and year (divided in months) as well as the tota of sales for every delegate
router.get('/', function(req, res, next) { 
  const data = {
    histogram: [],
    products: [],
    totalProducts: [],
    bricks: []
  }

  const filters = {
    histogram: {},
    products: {},
    totalProducts: {},
    bricks: {}
  }

  const { options } = req.query

  if (options.type === 'histogram') {
    const idDelegate = options.option_selected.delegate                   // default: Todos
    const year = options.option_selected.year                             // default: 2024

    data.histogram = Queries.getSaleHistogram(idDelegate, year)   
    filters.histogram.delegates = Queries.getDelegates(year)
    filters.histogram.years = Queries.getYears(idDelegate)

  } else if (options.type === 'bricks') {
    const idDelegate = options.option_selected.delegate
    const year = options.option_selected.year
    const idCompany = options.option_selected.company                        // default: Todos
    const idBrick = options.option_selected.bricks                           // default: Todos

    data.bricks = Queries.getSaleBricks(idDelegate, year, idCompany, idBrick)   
    filters.bricks.delegates = Queries.getDelegates(year,idCompany,idBrick)
    filters.bricks.years = Queries.getYears(idDelegate,idCompany,idBrick)
    filters.bricks.companies = Queries.getCompanies(idDelegate,year,idBrick)
    filters.bricks.bricks = Queries.getBricks(idDelegate,year,idCompany)
  
  } else if (options.type === 'products') {
    const idDelegate = options.option_selected.delegate
    const year = options.option_selected.year
    const idCompany = options.option_selected.company                        // default: Todos
    const idBrick = options.option_selected.bricks                           // default: Todos
    const idProduct = options.option_selected.bricks

    data.products = Queries.getSaleProducts(idDelegate, year, idCompany, idBrick, idProduct)   
    filters.products.delegates = Queries.getDelegates(year,idCompany,idBrick,idProduct)
    filters.products.years = Queries.getYears(idDelegate,idCompany,idBrick,idProduct)
    filters.products.companies = Queries.getCompanies(idDelegate,year,idBrick,idProduct)
    filters.products.bricks = Queries.getBricks(idDelegate,year,idCompany,idProduct)
    filters.products.products = Queries.getProducts(idDelegate,year,idCompany,idBrick)

  } else if (options.type === 'totalProducts') {
    const idDelegate = options.option_selected.delegate
    const idCompany = options.option_selected.company                        // default: Todos
    const idBrick = options.option_selected.bricks                           // default: Todos
    const idProduct = options.option_selected.bricks

    data.totalProducts = Queries.getSaleTotalProducts(idDelegate, idCompany, idBrick, idProduct)   
    filters.totalProducts.delegates = Queries.getDelegates(idCompany,idBrick,idProduct)
    filters.totalProducts.companies = Queries.getCompanies(idDelegate,idBrick,idProduct)
    filters.totalProducts.products = Queries.getProducts(idDelegate,idCompany,idBrick)
  }

  // Queries.getSale(res, req) 

  res.json({ data, filters });
});


router.get('/:id', function(req, res, next) { 
  const data = {
    histogram: [],
    products: [],
    totalProducts: [],
    bricks: []
  }

  const filters = {
    histogram: {},
    products: {},
    totalProducts: {},
    bricks: {}
  }
  
  const { idDelegate } = req.params
  const { options } = req.query
  const year = new Date().getFullYear()

  if (options.type === 'histogram') {              
    data.histogram = Queries.getSaleHistogram(idDelegate, year)

  } else if (options.type === 'bricks') {
    const idCompany = options.option_selected.company                        // default: Todos
    const idBrick = options.option_selected.bricks                           // default: Todos

    data.bricks = Queries.getSaleBricks(idDelegate, year, idCompany, idBrick) 
    filters.bricks.companies = Queries.getCompanies(idDelegate, year, idBrick)
    filters.bricks.bricks = Queries.getBricks(idDelegate, year, idCompany)  

  } else if (options.type === 'products') {
    const idCompany = options.option_selected.company                        // default: Todos
    const idBrick = options.option_selected.bricks                           // default: Todos
    const idProduct = options.option_selected.bricks

    data.products = Queries.getSaleProducts(idDelegate, year, idCompany, idBrick, idProduct)  
    filters.products.companies = Queries.getCompanies(idDelegate,year,idBrick,idProduct)
    filters.products.bricks = Queries.getBricks(idDelegate,year,idCompany,idProduct)
    filters.products.products = Queries.getProducts(idDelegate,year,idCompany,idBrick)
  } 
  
  // Queries.getSale(res, req) 

  res.json({ data, filters });
});


/*    POST sales   */
// Route responsible for sending the hmr file to the database
// TODO
router.post('/', function(req, res, next) { Queries.createDelegate(res, req) });




/*    GET delegate by id   */
// Route responsible for retrieving a delegate's details
// Should return a json structured variable with relevant information
router.get('/delegados/:id', function(req, res, next) { Queries.getDelegates(parseInt(req.params.id), res, req) });

/*    PUT delegate by id   */
// Route responsible for updating a delegate's details
router.put('/delegados/:id', function(req, res, next) { Queries.getDelegates(parseInt(req.params.id), res, req) });


/*    GET delegates   */
// Route responsible for retrieving the delegates
// Should return a json structured variable withe relevant information
router.get('/delegados', function(req, res, next) { Queries.getDelegates(res, req) });

/*    POST delegates    */
// Route responsible for registering a delegate
// Should receive a dictionary with the following:
  // First and Last name (Primeiro; Ultimo)
  // Distrito
  // Regiao
  // Freguesia
  // Estado
router.post('/delegados/registar', function(req, res, next) { Queries.createDelegate(res, req) });


/*    Get form's data    */
// Route responsible for retrieving the form's data for the admin
// Should return a json structured variable with:
  // the instituitions
  // the specialties
  // the districts
  // the regions
  // the towns
  // the products (?)
  router.get('/forms', function(req, res, next) { Queries.getSale(res, req) });


/* GET home page. */ // test queries
//router.get('/towns', function(req, res, next) { Queries.getTowns(res, req) });

module.exports = router;