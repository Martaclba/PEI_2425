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

  const  options  = req.body
  //console.log('Options received:', options);
  
  //Test if there is Null values
  function isValid(value) {
    return value !== null;
    // value ! undefined ????
   }

  try {
    
    if (options.type === 'histogram') {
      const idDelegate = options.option_selected.Delegate_H                    // default: Todos
      const year = options.option_selected.Year_H                              // default: 2024
      data.histogram = await Queries.getSaleHistogram(idDelegate, year) 
      //console.log(data)
      filters.histogram.delegates = await Queries.getDelegates(year, null, null, null)
      filters.histogram.years = await Queries.getYears(idDelegate)
      console.log("HHHH ", idDelegate, year)
      /*
      data.histogram = data.histogram
        .filter(item => isValid(item.month) && isValid(item.value)) // Filtra valores inválidos
        .map((item) => ({
        month: item.month,
        value: item.value,
      }));

      filters.histogram.delegates = filters.histogram.delegates
        .filter(delegate => isValid(delegate.name))
        .map((delegate, index) => ({
        label: delegate.name,
        value: index,
      }));

      filters.histogram.years = filters.histogram.years
        .filter(year => isValid(year))
        .map((year) => ({
          label: String(year),
          value: year,
      }));
      */
    } 
    else if (options.type === 'bricks') {
      const idDelegate = options.option_selected.Delegate_B
      const year = options.option_selected.Year_B
      const idCompany = options.option_selected.Company_B                        // default: Todos
      const idBrick = options.option_selected.Brick_B                           // default: Todos

      console.log("BBBB ", idDelegate, year, idCompany, idBrick)

      data.bricks = await Queries.getSaleBricks(idDelegate, year, idCompany, idBrick)   
      filters.bricks.delegates = await Queries.getDelegates(year,idCompany,idBrick, null)
      filters.bricks.years = await Queries.getYears(idDelegate,idCompany,idBrick, null)
      filters.bricks.companies = await Queries.getCompanies(idDelegate,year,idBrick, null)
      filters.bricks.bricks = await Queries.getBricks(idDelegate,year,idCompany, null)

      /*
      data.bricks = data.bricks.
        map((brick, index) => ({
          key: index,
          Brick: brick.brick_name,
          janeiro: brick.jan,
          fevereiro: brick.feb,
          marco: brick.mar,
          abril: brick.apr,
          maio: brick.may,
          junho: brick.jun,
          julho: brick.jul,
          agosto: brick.aug,
          setembro: brick.sep,
          outubro: brick.oct,
          novembro: brick.nov,
          dezembro: brick.dec,
        }));

      filters.bricks.delegates = filters.bricks.delegates.
        map((delegate, index) => ({
          label: delegate.name,
          value: index,
      }));

      filters.bricks.years = filters.bricks.years.
        map((year) => ({
          label: String(year),
          value: year,
      }));

      filters.bricks.companies = filters.bricks.companies.
        map((company, index) => ({
          label: company.company_name,
          value: index,
      }));

      filters.bricks.bricks = filters.bricks.bricks.
        map((brick, index) => ({
          label: brick.brick_name,
          value: index,
      }));
      */
    
    } else if (options.type === 'products') {
      const idDelegate = options.option_selected.Delegate_P
      const year = options.option_selected.Year_P
      const idCompany = options.option_selected.Company_P                        // default: Todos
      const idBrick = options.option_selected.Brick_P                           // default: Todos
      const idProduct = options.option_selected.Product_P

      console.log("PPPP ", idDelegate, year, idCompany, idBrick, idProduct)
      data.products = await Queries.getSaleProducts(idDelegate, year, idCompany, idBrick, idProduct)   
      filters.products.delegates = await Queries.getDelegates(year,idCompany,idBrick,idProduct)
      filters.products.years = await Queries.getYears(idDelegate,idCompany,idBrick,idProduct)
      filters.products.companies = await Queries.getCompanies(idDelegate,year,idBrick,idProduct)
      filters.products.bricks = await Queries.getBricks(idDelegate,year,idCompany,idProduct)
      filters.products.products = await Queries.getProducts(idDelegate,year,idCompany,idBrick)
      //console.log("Estrutura completa - products:", JSON.stringify(data.products, null, 2));
      //console.log("Estrutura completa - filters.products.delegates:", JSON.stringify(filters.products.delegates, null, 2));
      //console.log("Estrutura completa - filters.products.years:", JSON.stringify(filters.products.years, null, 2));
      //console.log("Estrutura completa - filters.products.companies:", JSON.stringify(filters.products.companies, null, 2));
      console.log("Estrutura completa - filters.products.bricks:", JSON.stringify(filters.products.bricks, null, 2));

      if (Array.isArray(data.products) && data.products.length > 0) {
        data.products = data.products.map((product, index) => ({
            key: index + 1,
            produto: product.product_name,
            janeiro: product.jan,
            fevereiro: product.feb,
            marco: product.mar,
            abril: product.apr,
            maio: product.may,
            junho: product.jun,
            julho: product.jul,
            agosto: product.aug,
            setembro: product.sep,
            outubro: product.oct,
            novembro: product.nov,
            dezembro: product.dec,
        }));
      }

      if (Array.isArray(filters.products.delegates) && filters.products.delegates.length > 0) {
        filters.products.delegates = filters.products.delegates
          .map((delegate, index) => ({
            label: delegate.delegate_name,
            value: delegate.id_delegate,
        }));
      } 

      if (Array.isArray(filters.products.years) && filters.products.years.length > 0) {
        filters.products.years = filters.products.years
          .map((year) => ({
            label: year,
            value: year,
        }));
      }

      if (Array.isArray(filters.products.companies) && filters.products.companies.length > 0) {
        filters.products.companies = filters.products.companies
          .map((company, index) => ({
            label: company.company_name,
            // para ja vai ficar o index mas depois temos que alterar para meter o id da empresa
            value: index,
        }));
      }
      /*if (Array.isArray(data.products) && data.products.length > 0) {
        data.products.forEach((product, index) => {
          console.log(`Produto ${index + 1}:`, Object.keys(product));
        });
      } else {
          console.log('Nenhum produto encontrado.');
      }*/

      if (Array.isArray(filters.products.bricks) && filters.products.brick.length > 0) {
        filters.products.bricks = filters.products.bricks
          .map((brick, index) => ({
            label: brick.brick_name,
            value: index,
        }));
      }

      if (Array.isArray(filters.products.products) && filters.products.products.length > 0) {
        filters.products.products = filters.products.products
          .map((product, index) => ({
            label: product.product_name,
            value: index,
        }));
      }
    

      
    } else if (options.type === 'totalProducts') {
      const idDelegate = options.option_selected.Delegate_TP
      const idCompany = options.option_selected.Company_TP                        // default: Todos
      const idBrick = options.option_selected.Brick_TP                            // default: Todos
      const idProduct = options.option_selected.Product_TP

      console.log("TPTP ", idDelegate, idCompany, idBrick, idProduct)
      data.totalProducts = await Queries.getSaleTotalProducts(idDelegate, idCompany, idBrick, idProduct)   
      filters.totalProducts.delegates = await Queries.getDelegates(null, idCompany,idBrick,idProduct)
      filters.totalProducts.companies = await Queries.getCompanies(idDelegate, null, idBrick, idProduct)
      filters.totalProducts.products = await Queries.getProducts(idDelegate, null,idCompany,idBrick)
      
      data.totalProducts = data.totalProducts.filter(product => 
        Object.keys(product).every(key => isValid(product[key])))
        .map((product, index) => ({
        key: index,
        2018: product['2018'],
        2019: product['2019'],
        2020: product['2020'],
        2021: product['2021'],
        2022: product['2022'],
        2023: product['2023'],
        2024: product['2024'],
      }));

      filters.totalProducts.delegates = filters.totalProducts.delegates
        .filter(delegate => isValid(delegate.name))
        .map((delegate, index) => ({
          label: delegate.name,
          value: index,
        }));

      filters.totalProducts.companies = filters.totalProducts.companies
        .filter(company => isValid(company.company_name))
        .map((company, index) => ({
          label: company.company_name,
          value: index,
      }));

      filters.totalProducts.bricks = filters.totalProducts.bricks
        .filter(brick => isValid(brick.brick_name))
        .map((brick, index) => ({
          label: brick.brick_name,
          value: index,
      }));
      
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
router.post('/import', function(req, res, next) { Queries.createDelegate(res, req) });




/*    GET delegates   */
// Route responsible for retrieving the delegates
// Should return a json structured variable withe relevant information
router.get('/delegados', function(req, res, next) { Queries.getDelegates(res, req) });
  // const data = []
  // const filters = {
  //   delegates:{},
  //   districts:{},
  //   regions:{}
  // }

  // const options = req.query
  //try{ const idDelegate = option.delegate
  //     const idDistrict = option.district
  //     const idRegion = option.region
  //     data = await Queries.getTableDelegates(idDelegate,idDistrict,idRegion)   
  //     filters.delegates = await Queries.getDelegates(idDistrict,idRegion)
  //     filters.districts = await Queries.getDistricts(idDelegate,idRegion)
  //     filters.regions = await Queries.getRegion(idDelegate,idDistrict) 
  //
  // if (Array.isArray(data) && data.length > 0) {
  //   data = data.map((delagate, index) => ({
  //       key: index + 1,
  //       delagado: delagate.delagate_name,
  //       brick: delagate.brick,
  //       distrito: delagate.district,
  //       regiao: delagate.region,
  //       freguesia: delagate.town,
  //       estado: [delagate.state],
  //   }));
  // }

//   if (Array.isArray(filters.delegates) && filters.delegates.length > 0) {
//     filters.delegates = filters.delegates
//       .map((delegate, index) => ({
//         label: delegate.delegate_name,
//         value: delegate.idDelegate,
//     }));
// }

// if (Array.isArray(filters.districts) && filters.districts.length > 0) {
//   filters.districts = filters.districts
//     .map((district,index) => ({
//       label: district.district_name,
//       value: index,
//   }));
// }

// if (Array.isArray(filters.regions) && filters.regions.length > 0) {
//   filters.regions = filters.regions
//     .map((region, index) => ({
//       label: region.region_name,
//       value: index,
//   }));
// }




/*    GET delegate by id   */
// Route responsible for retrieving a delegate's details
/* Return:
const delegate = {
    Nome: {
        Primeiro: 'John',
        Ultimo: 'Doe',
    },
    Distrito: 'Porto',
    Regiao: 'Trofa',
    Freguesia: 'Lousado',                        // Not required
    Estado: ['Ativo'],
};
*/
router.get('/delegados/:id', function(req, res, next) { Queries.getDelegates(parseInt(req.params.id), res, req) });

/*    PUT delegate by id   */
// Route responsible for updating a delegate's details
router.put('/delegados/:id', function(req, res, next) { Queries.getDelegates(parseInt(req.params.id), res, req) });


/*    POST delegates    */
// Route responsible for registering a delegate
// Should receive a dictionary with the following:
  // First and Last name (Primeiro; Ultimo)
  // Distrito
  // Regiao
  // Freguesia
  // Estado
router.post('/delegados/registar', function(req, res, next) { Queries.createDelegate(res, req) });





router.get('/medicos', function(req, res, next) { Queries.getDoctors(res, req) });

/*    GET doctor by id   */
// Route responsible for retrieving a doctors's details
/* Return:
const doctor = {
    Nome: 'John',
    Instituicao: 'Hospital do Bonfim',
    Especialidade: 'Pediatra',
    Distrito: 'Braga',
    Regiao: 'Braga',
    Freguesia: '',                               // Not required
    Rua: 'Rua bla bla bla',
    Codigo_postal: '1234-567',
    Edificio: '1º Esq',                          // Not required
    Telefone: '123456789',
    Email: 'example@hotmail.com',                // Not required
    Estado: ['Inativo'],
    Notas: 'Some default notes here...',         // Not required
};
*/
router.get('/medicos/:id', function(req, res, next) { Queries.getDoctors(parseInt(req.params.id), res, req) });



router.get('/farmacias', function(req, res, next) { Queries.getPharmacies(res, req) });

/*    GET pharmacy by id   */
// Route responsible for retrieving a pharmacy's details
/* Return:
 const pharmacy = {
    Nome: 'Farmácia A',
    Distrito: 'Braga',
    Regiao: 'Celeirós',
    Freguesia: 'Celeirós',                        // Not required                                  
    Rua: 'Rua bla bla bla',
    Codigo_postal: '1234-567',
    Edificio: '1º Esq',                           // Not required
    Telefone: '123456789',                         
    Email: 'example@hotmail.com',                 // Not required
    Estado: ['Indisponível'],
    Notas: '',                                    // Not required             
    Produtos: [{ key: '1', label: 'Produto 1' }]  // Not required 
};
*/
router.get('/farmacias/:id', function(req, res, next) { Queries.getPharmacies(parseInt(req.params.id), res, req) });






/*    Get form's data    */
// Route responsible for retrieving the form's data for the admin
// Should return a json structured variable with:
  // the instituitions
  // the specialties
  // the districts
  // the regions
  // the towns
  // the products
  // doctors
  // pharmacies
router.get('/forms', function(req, res, next) { Queries.getSale(res, req) });

router.get('/forms/:id', function(req, res, next) { Queries.getSale(res, req) });



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