const express = require('express');
const router = express.Router();
const multer  = require('multer')
const fs = require('fs');

var Queries = require('./queries')

const path = require('path');
const dirPath = path.join(__dirname, '../uploads');


// Configure multer storage
const storage = multer.diskStorage({  
  // Where to store the files
  destination: function (req, file, cb) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Directory created: ${dirPath}`);
    } else {
      console.log(`Directory already exists: ${dirPath}`);
    }

    // Ensure the '/uploads' directory exists
    cb(null, '../api/uploads'); 
  },

  // Set an unique name
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now()
    cb(null, file.originalname + '-' + uniqueSuffix + '.xlsx')
  },
});

// Configure multer upload settings
const upload = multer({ storage: storage });


/*    POST delegates (import) */
// Route responsible for registering multiple delegates via file uploading
router.post('/import/delegados', function(req, res, next) { 
  
  // Queries.createDelegate(res, req) 

});


router.post('/import/competition', upload.single('excelFile'), async function(req, res, next) {
  if (!req.file) {
      return res.status(400).json({ error: 'No competition sales file uploaded' });
  }
  const spawnSync = require("node:child_process").spawnSync;
  try {
    const child = await spawnSync('python3',["../database/import_conc.py", req.file.destination + "/" + req.file.filename], {capture: ['stdout', 'stderr', 'on']});
    console.log('File uploaded:', req.file);
    res.status(201).json({ message: child.stdout });
  }
  catch (err) {
    res.status(530).json({ error:err, msg: child.stdout})
  }

});

/*    POST sales (import)   */
// Route responsible for sending the hmr file to the database
router.post('/import/', upload.single('excelFile'), async function(req, res, next) {
  if (!req.file) {
      return res.status(400).json({ error: 'No sales file uploaded' });
  }
  const spawnSync = require("node:child_process").spawnSync;
  try {
    const child = await spawnSync('python3',["../database/import_mp.py", req.file.destination + "/" + req.file.filename], {capture: ['stdout', 'stderr', 'on']});
    console.log('File uploaded:', req.file);
    res.status(201).json({ message: child.stdout });
  }
  catch (err) {
    res.status(530).json({ error:err, msg: child.stdout});
  }
});



/*    Get form's data    */
// Route responsible for retrieving the form's data for the delegate
// Should return a json structured variable with:
  // the instituitions
  // the specialties
  // the districts
  // the regions
  // the towns
  // doctors
  // pharmacies
router.get('/forms/:id', async function(req, res, next) { 
  const idDelegate = parseInt(req.params.id)

  const data = {
    districts: [],
    regions: [],
    towns: [],
    instituitions: [],
    specialties: [],
    doctors: [],
    pharmacies: [],
  }

  try{
    data.districts = await Queries.getDistricts()
    data.regions = await Queries.getRegions()
    data.towns = await Queries.getTowns()
    data.instituitions = await Queries.getInstitutions()
    data.specialties = await Queries.getSpecialities()

    data.doctors = await Queries.getDoctors(idDelegate)
    data.pharmacies = await Queries.getPharmacies(idDelegate)
    
    res.status(200).json({data})
  } catch (err) {
    res.status(501).json({error: err, msg: "Error obtaining form's data"});
  }
});
  
// Route responsible for retrieving the form's data for the admin
// Should return a json structured variable with:
  // the instituitions
  // the specialties
  // the districts
  // the regions
  // the towns
  // the products
router.get('/forms', async function(req, res, next) { 
  const data = {
    districts: [],
    regions: [],
    towns: [],
    instituitions: [],
    specialties: [],
    products: []
  }

  try{
    data.districts = await Queries.getDistricts()
    data.regions = await Queries.getRegions()
    data.towns = await Queries.getTowns()
    data.instituitions = await Queries.getInstitutions()
    data.specialties = await Queries.getSpecialities()
    data.products = await Queries.getProducts(null, null, null, null)

    res.status(200).json({data})

  } catch (err) {
    res.status(501).json({error: err, msg: "Error obtaining form's data"});
  }
});





/*    POST visits    */
// Route responsible for registering a visit
const visit = {
  Entidade: 'Médico',
  Comprador: 2,
  date: '24-11-2025',
}
router.post('/visitas/registar', async function(req, res, next) {

  const visit = req.body
  console.log("VISIT: ", visit)

  try {
    
  } catch (err) {
    res.status(501).json({error: err, msg: "Error scheduling a visit"});
  }
  
});


/*    GET visits   */
// Route responsible for retrieving the visits of a delegate (id)
// Should return a json structured variable with relevant information
const data_visits = [
  {
    key: 0,
    data: '12-01-2025',
    comprador: 'Médico i',                  // pode ser um médico ou uma farmácia
    distrito: `Distrito i`,
    regiao: `Região i`,      
    freguesia: `Freguesia i`,
    morada: `Rua i`,  
  },
  {
    key: 1,
    data: '12-01-2025',
    comprador: 'Farmácia da esquina',      // pode ser um médico ou uma farmácia
    distrito: `Distrito i`,
    regiao: `Região i`,      
    freguesia: `Freguesia i`,
    morada: `Rua i`,  
  },
]
router.post('/visitas/:id', async function(req, res, next) {
  const data = []

  const filters = {
    date: [],
    entities: [], 
    districts: [],
    regions: []
  }
  const default_filter = { label: '-- Todos --', value: 'Todos'}
  const idDelegate = req.params.id

  const option_selected = req.body
  console.log(option_selected)

  // try{
  //   const date = option_selected.date
  //   const entity = option_selected.entity                       // default: Todos
  //   const district = option_selected.district                   // default: Todos
  //   const region = option_selected.region                       // default: Todos

  //   data = await Queries.getVisits(idDelegate)   
  //   filters.date = await Queries.getDelegates(year,idCompany,idBrick, null)
  //   filters.entities = await Queries.getYears(idDelegate,idCompany,idBrick, null)
  //   filters.districts = await Queries.getCompanies(idDelegate,year,idBrick, null)
  //   filters.regions = await Queries.getBricks(idDelegate,year,idCompany, null)

  //   // Add missing default option 
  //   filters.date.unshift(default_filter)
  //   filters.entities.unshift(default_filter)
  //   filters.districts.unshift(default_filter)
  //   filters.regions.unshift(default_filter)

  //   res.status(200).json({ data, filters })
  // } catch (err) {
  //   res.status(501).json({error: err, msg: "Error obtaining scheduled visits"});
  // }

});



/*    POST delegates    */
// Route responsible for registering a delegate
router.post('/delegados/registar', function(req, res, next) { 
  
  // Queries.createDelegate(res, req) 

});

/*    GET delegates   */
// Route responsible for retrieving the delegates
// Should return a json structured variable with relevant information
router.post('/delegados', async function(req, res, next) {;
  let data = []

  const filters = {
    delegates: {},
    districts: {},
    regions: {}
  }

  const options = req.body

  const default_filter = { label: '-- Todos --', value: 'Todos'}

  try { 
      const idDelegate = options.delegado
      const idDistrict = options.distrito
      const idRegion = options.regiao

      data = await Queries.getTableDelegates(idDelegate,idDistrict,idRegion)

      filters.delegates = await Queries.getDelegatesFilters('general_delegates_and_bricks',idDistrict,idRegion)
      filters.districts = await Queries.getDistrictsFilters('general_delegates_and_bricks',idDelegate,idRegion)
      filters.regions = await Queries.getRegionsFilters('general_delegates_and_bricks',idDelegate,idDistrict) 
  
        // Add missing default option 
        filters.delegates.unshift(default_filter)
        filters.districts.unshift(default_filter)
        filters.regions.unshift(default_filter)

    res.status(200).json({ data, filters });
  }
  catch (err) {
    res.status(501).json({error: err, msg: "Error obtaining delegates table"});
  }
});


/*    Get delegate by id   */
// Route responsible for retrieving a delegate's details
// Return:
const delegate = {
    Nome: {
      Primeiro: 'John',
      Ultimo : 'Doe'
    },
    Distrito: 'Braga',
    Regiao: 'Braga',
    Freguesia: '',                               // Not required
    Estado: ['Inativo'],
};
router.get('/delegados/detalhes/:idDelegate', function(req, res, next) { 
  
  // Queries.getDelegates(parseInt(req.params.id), res, req) 

});

/*    PUT delegate by id   */
// Route responsible for updating a delegate's details
router.put('/delegados/detalhes/:idDelegate', function(req, res, next) { 

  // Queries.getDelegates(parseInt(req.params.id), res, req) 

});



router.post('/medicos', function(req, res, next) { 
  //Queries.getDoctors(res, req) 

  const data = []
  
  const filters = {
    doctors: {},
    districts: {},
    institution: {}
  }

  const options = req.body

//   try{ 
//       const idDoctor = option.doctor
//       const idDistrict = option.district
//       const idInstitution = option.region
//       data = await Queries.getTableDoctors(idDoctors,idDistrict,idInstitution)   
//       filters.delegates = await Queries.getMedicos(idDistrict,idInstitution)
//       filters.districts = await Queries.getDistricts(null,idDoctors,null,idInstitution)
//       filters.regions = await Queries.getInstitution(idDoctors,idDistrict) 

//     res.status(200).json({ data, filters });
//   }
//   catch (err) {
//     res.status(501).json({error: err, msg: "Error obtaining doctors table"});
//   }
});

/*    GET doctor by id   */
// Route responsible for retrieving a doctors's details
//Return:
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
router.get('/medicos/detalhes/:idDoctor', function(req, res, next) { Queries.getDoctors(parseInt(req.params.id), res, req) });



router.post('/farmacias', function(req, res, next) { 
  //Queries.getPharmacies(res, req) 

//   const data = []
//   const filters = {
//     pharmacies:{},
//     districts:{},
//     regions:{}
//   }

//   const options = req.bo

//   try{ 
//       const idPharmacy = option.pharmacy
//       const idDistrict = option.district
//       const idRegion = option.region
//       data = await Queries.getTablePharmacies(idPharmacy,idDistrict,idRegion)   
//       filters.pharmacies = await Queries.getDelegates(idDistrict,idRegion)
//       filters.districts = await Queries.getDistricts(null,null,idPharmacy,idRegion)
//       filters.regions = await Queries.getRegion(null,idPharmacy,idDistrict) 

//     res.status(200).json({ data, filters });
//   }
//   catch (err) {
//     res.status(501).json({error: err, msg: "Error obtaining delagates table"});
//   }
});

/*    GET pharmacy by id   */
// Route responsible for retrieving a pharmacy's details
//Return:
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
router.get('/farmacias/detalhes/:idPharmacy', function(req, res, next) { 
  Queries.getPharmacies(parseInt(req.params.id), res, req) 
});



/*    GET sales    */ 
// Route responsible for retrieving the dashboard's data for each kind of user.
// Should return a json structured variable with: 
  // the total of sales for each delegate and year as well as the total of sales for every delegate; 
  // the total of sales by product for each delegate,  year (divided in months) and company as well as the tota of sales for every delegate
  // the total of sales by brick for each delegate and year (divided in months) as well as the tota of sales for every delegate
router.post('/:id', async function(req, res, next) { 
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
  
  const default_filter = { label: '-- Todos --', value: 'Todos'}
  const year = new Date().getFullYear()

  const idDelegate = req.params.id
  const { type, option_selected } = req.body

  // console.log('Type:', type, "Option Select: ", option_selected);

  try {
    if (type === 'histogram') {              
      data.histogram = await Queries.getSaleHistogram(idDelegate, year)
      filters.histogram.delegates = await Queries.getDelegates(year, null, null, null),
      filters.histogram.years = await Queries.getYears(idDelegate)

      // Add missing default option 
      filters.histogram.delegates.unshift(default_filter)

    } else if (type === 'bricks') {
      const idCompany = option_selected.Company_B                       // default: Todos
      const idBrick = option_selected.Brick_B                           // default: Todos

      data.bricks= await Queries.getSaleBricks(idDelegate, year, idCompany, idBrick)   
      filters.bricks.companies = await Queries.getCompanies(idDelegate,year,idBrick, null)
      filters.bricks.bricks = await Queries.getBricks(idDelegate,year,idCompany, null)
      
      // Add missing default option 
      filters.bricks.bricks.unshift(default_filter)

    } else if (type === 'products') {
      const idCompany = option_selected.Company_P                        // default: Todos
      const idBrick = option_selected.Brick_P                            // default: Todos
      const idProduct = option_selected.Product_P
      
      data.products = await Queries.getSaleProducts(idDelegate, year, idCompany, idBrick, idProduct)
      filters.products.companies = await Queries.getCompanies(idDelegate,year,idBrick,idProduct)
      filters.products.bricks = await Queries.getBricks(idDelegate,year,idCompany,idProduct)
      filters.products.products = await Queries.getProducts(idDelegate,year,idCompany,idBrick)
      
      // Add missing default option 
      filters.products.bricks.unshift(default_filter)
      filters.products.products.unshift(default_filter)

    } 

    res.status(200).json({ data, filters });
  }
  catch (err) {
    res.status(501).json({error: err, msg: "Error obtaining sales"});
  }
});

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

  const default_filter = { label: '-- Todos --', value: 'Todos'}

  const { type, option_selected } = req.body
  
  try {
    if (type === 'histogram') {
      const idDelegate = option_selected.Delegate_H                    // default: Todos
      const year = option_selected.Year_H                              // default: 2024

      data.histogram = await Queries.getSaleHistogram(idDelegate, year)
      filters.histogram.delegates = await Queries.getDelegates(year, null, null, null),
      filters.histogram.years = await Queries.getYears(idDelegate)

      // Add missing default option 
      filters.histogram.delegates.unshift(default_filter)
    
    } else if (type === 'bricks') {
        const idDelegate = option_selected.Delegate_B
        const year = option_selected.Year_B
        const idCompany = option_selected.Company_B                       // default: Todos
        const idBrick = option_selected.Brick_B                           // default: Todos

        data.bricks= await Queries.getSaleBricks(idDelegate, year, idCompany, idBrick)   
        filters.bricks.delegates = await Queries.getDelegates(year,idCompany,idBrick, null)
        filters.bricks.years = await Queries.getYears(idDelegate,idCompany,idBrick, null)
        filters.bricks.companies = await Queries.getCompanies(idDelegate,year,idBrick, null)
        filters.bricks.bricks = await Queries.getBricks(idDelegate,year,idCompany, null)

        // Add missing default option 
        filters.bricks.delegates.unshift(default_filter)
        filters.bricks.bricks.unshift(default_filter)
    
    } else if (type === 'products') {
        const idDelegate = option_selected.Delegate_P
        const year = option_selected.Year_P
        const idCompany = option_selected.Company_P                        // default: Todos
        const idBrick = option_selected.Brick_P                            // default: Todos
        const idProduct = option_selected.Product_P
        
        data.products = await Queries.getSaleProducts(idDelegate, year, idCompany, idBrick, idProduct)
        filters.products.delegates = await Queries.getDelegates(year,idCompany,idBrick,idProduct)
        filters.products.years = await Queries.getYears(idDelegate,idCompany,idBrick,idProduct)
        filters.products.companies = await Queries.getCompanies(idDelegate,year,idBrick,idProduct)
        filters.products.bricks = await Queries.getBricks(idDelegate,year,idCompany,idProduct)
        filters.products.products = await Queries.getProducts(idDelegate,year,idCompany,idBrick)
        
        // Add missing default option 
        filters.products.delegates.unshift(default_filter)
        filters.products.bricks.unshift(default_filter)
        filters.products.products.unshift(default_filter)

    } else if (type === 'totalProducts') {
        const idDelegate = option_selected.Delegate_TP
        const idCompany = option_selected.Company_TP                        // default: Todos
        const idBrick = option_selected.Brick_TP                            // default: Todos
        const idProduct = option_selected.Product_TP
        
        data.totalProducts = await Queries.getSaleTotalProducts(idDelegate, idCompany, idBrick, idProduct)   
        filters.totalProducts.delegates = await Queries.getDelegates(null, idCompany,idBrick,idProduct)
        filters.totalProducts.companies = await Queries.getCompanies(idDelegate, null, idBrick, idProduct)
        filters.totalProducts.bricks = await Queries.getBricks(idDelegate,null, idCompany, idProduct)
        filters.totalProducts.products = await Queries.getProducts(idDelegate, null,idCompany,idBrick)
    
        // Add missing default option 
        filters.totalProducts.delegates.unshift(default_filter)
        filters.totalProducts.bricks.unshift(default_filter)
        filters.totalProducts.products.unshift(default_filter)
    }
      
    res.status(200).json({ data, filters });
  }
  catch (err) {
    res.status(501).json({error: err, msg: "Error obtaining sales"});
  }
});
  
module.exports = router;
