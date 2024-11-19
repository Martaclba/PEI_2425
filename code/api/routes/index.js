const express = require('express');
const router = express.Router();

var Queries = require('./queries')

// options = {
//   option_selected: { year: '2024', delegate: 'Todos' }              (example)
//   type: (histogram/products/totalProducts/bricks)                   (to know what to put on "data")
// }


router.get('/towns', async function (req, res, next) {
  try {
    const towns = await Queries.getDelegates(null); // Wait for the function to resolve
    res.status(200).json(towns); // Respond with the data
  } catch (err) {
    res.status(521).json({ error: err, msg: "ARDEU AMIGO" }); // Handle the error
  }
});

/*    GET sales    */ 
// Route responsible for retrieving the dashboard's data for each kind of user.
// Should return a json structured variable with: 
  // the total of sales for each delegate and year as well as the total of sales for every delegate; 
  // the total of sales by product for each delegate,  year (divided in months) and company as well as the tota of sales for every delegate
  // the total of sales by brick for each delegate and year (divided in months) as well as the tota of sales for every delegate
router.post('/', async function(req, res, next) { 
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

  const { options } = req.body
  console.log('Options received:', options);
  
  try {
    if (options.type === 'histogram') {
      const idDelegate = options.option_selected.Delegado_H                    // default: Todos
      const year = options.option_selected.Ano_H                              // default: 2024

      // data.histogram = await Queries.getSaleHistogram(idDelegate, year)   
      // filters.histogram.delegates = await Queries.getDelegates(year, null, null, null)
      // filters.histogram.years = await Queries.getYears(idDelegate)
      console.log("HHHH ", idDelegate, year)
    } 
    else if (options.type === 'bricks') {
      const idDelegate = options.option_selected.Delegado_B
      const year = options.option_selected.Ano_B
      const idCompany = options.option_selected.Empresa_B                        // default: Todos
      const idBrick = options.option_selected.Brick_B                           // default: Todos

      console.log("BBBB ", idDelegate, year, idCompany, idBrick)

      // data.bricks = await Queries.getSaleBricks(idDelegate, year, idCompany, idBrick)   
      // filters.bricks.delegates = await Queries.getDelegates(year,idCompany,idBrick, null)
      // filters.bricks.years = await Queries.getYears(idDelegate,idCompany,idBrick, null)
      // filters.bricks.companies = await Queries.getCompanies(idDelegate,year,idBrick, null)
      // filters.bricks.bricks = await Queries.getBricks(idDelegate,year,idCompany, null)
    
    } else if (options.type === 'products') {
      const idDelegate = options.option_selected.Delegado_P
      const year = options.option_selected.Ano_P
      const idCompany = options.option_selected.Empresa_P                        // default: Todos
      const idBrick = options.option_selected.Brick_P                           // default: Todos
      const idProduct = options.option_selected.Product_P

      console.log("PPPP ", idDelegate, year, idCompany, idBrick, idProduct)
      // data.products = await Queries.getSaleProducts(idDelegate, year, idCompany, idBrick, idProduct)   
      // filters.products.delegates = await Queries.getDelegates(year,idCompany,idBrick,idProduct)
      // filters.products.years = await Queries.getYears(idDelegate,idCompany,idBrick,idProduct)
      // filters.products.companies = await Queries.getCompanies(idDelegate,year,idBrick,idProduct)
      // filters.products.bricks = await Queries.getBricks(idDelegate,year,idCompany,idProduct)
      // filters.products.products = await Queries.getProducts(idDelegate,year,idCompany,idBrick)

    } else if (options.type === 'totalProducts') {
      const idDelegate = options.option_selected.Delegado_TP
      const idCompany = options.option_selected.Empresa_TP                        // default: Todos
      const idBrick = options.option_selected.Brick_TP                            // default: Todos
      const idProduct = options.option_selected.Product_TP

      console.log("TPTP ", idDelegate, idCompany, idBrick, idProduct)
      // data.totalProducts = await Queries.getSaleTotalProducts(idDelegate, idCompany, idBrick, idProduct)   
      // filters.totalProducts.delegates = await Queries.getDelegates(null, idCompany,idBrick,idProduct)
      // filters.totalProducts.companies = await Queries.getCompanies(idDelegate, null, idBrick, idProduct)
      // filters.totalProducts.products = await Queries.getProducts(idDelegate, null,idCompany,idBrick)
    }

    res.status(200).json({ data, filters });
  }
  catch (err) {
    res.status(501).json({error: err, msg: "Error obtaining sales"});
  }
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

  try {
    if (options.type === 'histogram') {              
      data.histogram = Queries.getSaleHistogram(idDelegate, year)

    } else if (options.type === 'bricks') {
      const idCompany = options.option_selected.company                        // default: Todos
      const idBrick = options.option_selected.bricks                           // default: Todos

      data.bricks = Queries.getSaleBricks(idDelegate, year, idCompany, idBrick) 
      filters.bricks.companies = Queries.getCompanies(idDelegate, year, idBrick, null)
      filters.bricks.bricks = Queries.getBricks(idDelegate, year, idCompany, null)  

    } else if (options.type === 'products') {
      const idCompany = options.option_selected.company                        // default: Todos
      const idBrick = options.option_selected.bricks                           // default: Todos
      const idProduct = options.option_selected.bricks

      data.products = Queries.getSaleProducts(idDelegate, year, idCompany, idBrick, idProduct)  
      filters.products.companies = Queries.getCompanies(idDelegate,year,idBrick,idProduct)
      filters.products.bricks = Queries.getBricks(idDelegate,year,idCompany,idProduct)
      filters.products.products = Queries.getProducts(idDelegate,year,idCompany,idBrick)
    } 
    res.status(200).json({ data, filters });
  }
  catch (err) {
    res.status(501).json({error: err, msg: "Error obtaining sales"});
  }
});


/*    POST sales   */
// Route responsible for sending the hmr file to the database
// TODO
// router.post('/', function(req, res, next) { Queries.createDelegate(res, req) });




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
router.get('/towns', async function (req, res, next) {
  try {
    const towns = await Queries.getTowns(); // Wait for the function to resolve
    res.status(200).json(towns); // Respond with the data
  } catch (err) {
    res.status(521).json({ error: err, msg: "ARDEU AMIGO" }); // Handle the error
  }
});


module.exports = router;