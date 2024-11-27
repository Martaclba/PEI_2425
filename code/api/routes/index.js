const express = require('express');
const router = express.Router();
const multer  = require('multer')
const fs = require('fs');

var Queries = require('./queries')

const path = require('path');
const dirPath = path.join(__dirname, '../uploads');


//
function splitName(fullName) {
  // Trim any leading or trailing whitespace
  fullName = fullName.trim();
  if (!fullName) {
    return { Primeiro: '', Ultimo: '' };
  }
  
  if (fullName.length === 2) {
    return{ Primeiro: fullName[0], Ultimo: fullName[1] }
  };
  
  const parts = fullName.split(' ');
  const primeiro = parts[0] || ''; 
  const ultimo = parts.slice(1).join(' ') || ''; 

  return { Primeiro: primeiro, Ultimo: ultimo, }
}

//
function parseAddress(address) {
  // Split the address by commas and trim spaces around the parts
  const parts = address.split(',').map(part => part.trim());

  return {
    Rua: parts[0] || '',          
    Codigo_Postal: parts[1] || '', 
    Edificio: parts[2] || ''       
  };
}

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


/*    POST sales competition (import)   */
// Route responsible for sending the hmr file to the database
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


router.get('/institutions/:idDoctor', async function(req, res, next) { 

  try{


    // res.status(200).json({data})

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
  }
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

  try{
     const date = option_selected.date
     const entity = option_selected.entity                       

    //  data = await Queries.getVisits(idDelegate,date,entity) 
    //  filters.date = await Queries.getDate(idDelegate,entity)  
    //  filters.entities = await Queries.getEntities(idDelegate,data)
  //   // Add missing default option 
  //   filters.date.unshift(default_filter)
  //   filters.entities.unshift(default_filter)
  //   filters.districts.unshift(default_filter)
  //   filters.regions.unshift(default_filter)

    res.status(200).json({ data, filters })
  } catch (err) {
     res.status(501).json({error: err, msg: "Error obtaining scheduled visits"});
  }
  
});



/*    POST delegates    */
// Route responsible for registering a delegate

/*

{
  Primeiro: 'asda', 
  Ultimo: 'asd', 
  Distrito: 'adsd', 
  Regiao: 'asdasd', 
  Freguesia: 'asd', 
  Estado: [{label: 'Ativo', value: 'green'}]
}

*/
router.post('/delegados/registar', function(req, res, next) { 
  
  const delegate = req.body

  try {
    Queries.createDelegate(delegate)

    res.status(201).json({msg: "Doctor successfully registered"})
  } catch (err) {
    res.status(503).json({error: err, msg: "Error registering a doctor"});
  }
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

  const option = req.body

  const default_filter = { label: '-- Todos --', value: 'Todos'}

  try { 
      const idDelegate = option.delegado
      const idDistrict = option.distrito
      const idRegion = option.regiao

      data = await Queries.getTableDelegates(idDelegate,idDistrict,idRegion)

      filters.delegates = await Queries.getDelegates_DelegatesFilters(idDistrict,idRegion)
      filters.districts = await Queries.getDelegates_DistrictsFilters(idDelegate,idRegion)
      filters.regions = await Queries.getDelegates_RegionsFilters(idDelegate,idDistrict) 
  
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
router.get('/delegados/detalhes/:brick', async function(req, res, next) { 
  let delegate_raw = {}
  const delegate = {
    Nome: {
      Primeiro: '',
      Ultimo : ''
    },
    Distrito: '',
    Regiao: '',
    Freguesia: '',                               // Not required
    Estado: [],
  }

  const brick = parseInt(req.params.brick)

  try {
    
    delegate_raw = await Queries.getDelegateById(brick)
    
    delegate.Nome = splitName(delegate_raw.delegate)
    delegate.Distrito = delegate_raw.district
    delegate.Regiao = delegate_raw.region
    delegate.Freguesia = delegate_raw.parish
    delegate.Estado.push(delegate_raw.state)

    res.status(200).json(delegate);
  } catch (err) {
    res.status(501).json({error: err, msg: "Error obtaining delegate's details"});
  }
});

/*    PUT delegate by id   */
// Route responsible for updating a delegate's details
router.put('/delegados/detalhes/:idDelegate', function(req, res, next) { 

  // Queries.getDelegates(parseInt(req.params.id), res, req) 

});



/*    GET doctor by id   */
// Route responsible for retrieving a doctors's details
router.get('/medicos/detalhes/:idDoctor',async function(req, res, next) { 
  let doctor_raw = {}

  const doctor = {
    Nome: '',
    Instituicao: '',
    Especialidade: '',
    Distrito: '',
    Regiao: '',
    Freguesia: '',            // Not required
    Rua: '',
    Codigo_postal: '',
    Edificio: '',             // Not required
    Telefone: '',
    Email: '',                // Not required
    Estado: [],
    Notas: '',
  }

  const idDoctor = parseInt(req.params.idDoctor)

  try {    
    doctor_raw = await Queries.getDoctorById(idDoctor)
    const address = parseAddress(doctor_raw.full_address)
    
    doctor.Nome = doctor_raw.medico
    doctor.Instituicao = doctor_raw.instituition
    doctor.Especialidade = doctor_raw.specialty
    doctor.Distrito = doctor_raw.district
    doctor.Regiao = doctor_raw.region
    doctor.Freguesia = doctor_raw.town
    doctor.Rua = address.Rua
    doctor.Codigo_postal = address.Codigo_Postal
    doctor.Edificio = address.Edificio
    doctor.Telefone = doctor_raw.phone
    doctor.Email = doctor_raw.email
    doctor.Estado.push(doctor_raw.state)
    doctor.Notas = doctor_raw.notes

    console.log("GET DOCTOR: ", doctor)

    res.status(200).json(doctor);
  } catch (err) {
    res.status(501).json({error: err, msg: "Error obtaining doctor's details"});
  } 
});

/*    POST doctor    */
// Route responsible for registering a doctor
router.post('/medicos/registar', function(req, res, next) { 
  
  const doctor = req.body

  console.log("DOCTOR: ", doctor) 

  try {
    Queries.createDoctor(doctor)

    res.status(201).json({msg: "Doctor successfully registered"})
  } catch (err) {
    res.status(521).json({error: err, msg: "Error registering a doctor"});
  }

});


router.post('/medicos/:id', async function(req, res, next) { 
  let data = []
  
  const filters = {
    doctors: {},
    districts: {},
    institutions: {}
  }

  const option = req.body

  const idDelegate = req.params.id

  const default_filter = { label: '-- Todos --', value: 'Todos'}

  try{ 
      const idDoctor = option.medico
      const idDistrict = option.distrito
      const idInstitution = option.instituicao

      data = await Queries.getTableDoctors(idDoctor,idDistrict,idInstitution, idDelegate)   
      
      filters.doctors = await Queries.getDoctors_DoctorsFilters(idDistrict,idInstitution, idDelegate)
      filters.districts = await Queries.getDoctors_DistrictsFilters(idDoctor,idInstitution,idDelegate)
      filters.institutions = await Queries.getDoctors_InstitutionsFilters(idDoctor,idDistrict, idDelegate) 

      // Add missing default option 
      filters.doctors.unshift(default_filter)
      filters.districts.unshift(default_filter)
      filters.institutions.unshift(default_filter)

    res.status(200).json({ data, filters });
  }
  catch (err) {
    res.status(501).json({error: err, msg: "Error obtaining doctors table"});
  }
});

router.post('/medicos', async function(req, res, next) { 
  let data = []
  
  const filters = {
    doctors: {},
    districts: {},
    institutions: {}
  }

  const option = req.body

  const default_filter = { label: '-- Todos --', value: 'Todos'}

  try{ 
      const idDoctor = option.medico
      const idDistrict = option.distrito
      const idInstitution = option.instituicao

      data = await Queries.getTableDoctors(idDoctor,idDistrict,idInstitution, null)   
      
      filters.doctors = await Queries.getDoctors_DoctorsFilters(idDistrict,idInstitution, null)
      filters.districts = await Queries.getDoctors_DistrictsFilters(idDoctor,idInstitution,null)
      filters.institutions = await Queries.getDoctors_InstitutionsFilters(idDoctor,idDistrict, null) 

      // Add missing default option 
      filters.doctors.unshift(default_filter)
      filters.districts.unshift(default_filter)
      filters.institutions.unshift(default_filter)

    res.status(200).json({ data, filters });
  }
  catch (err) {
    res.status(501).json({error: err, msg: "Error obtaining doctors table"});
  }
});



router.post('/farmacias/:id', async function(req, res, next) { 
  let data = []

  const filters = {
    pharmacies: {},
    districts: {},
    regions: {}
  }

  const idDelegate = req.params.id

  const option = req.body

  const default_filter = { label: '-- Todos --', value: 'Todos'}

  try{ 
    const idPharmacy = option.farmacia
    const idDistrict = option.distrito
    const idRegion = option.regiao
    
    data = await Queries.getTablePharmacies(idPharmacy,idDistrict,idRegion, idDelegate)

    filters.pharmacies = await Queries.getPharmacies_PharmaciesFilters(idDistrict,idRegion, idDelegate)
    filters.districts = await Queries.getPharmacies_DistrictsFilters(idPharmacy,idRegion, idDelegate)
    filters.regions = await Queries.getPharmacies_RegionsFilters(idPharmacy,idDistrict, idDelegate) 

    // Add missing default option 
    filters.pharmacies.unshift(default_filter)
    filters.districts.unshift(default_filter)
    filters.regions.unshift(default_filter)

    res.status(200).json({ data, filters });
  }
  catch (err) {
    res.status(501).json({error: err, msg: "Error obtaining pharmacies table"});
  }
});

router.post('/farmacias', async function(req, res, next) { 
  let data = []

  const filters = {
    pharmacies: {},
    districts: {},
    regions: {}
  }

  const option = req.body

  const default_filter = { label: '-- Todos --', value: 'Todos'}

  try{ 
    const idPharmacy = option.farmacia
    const idDistrict = option.distrito
    const idRegion = option.regiao
    
    data = await Queries.getTablePharmacies(idPharmacy,idDistrict,idRegion, null)

    filters.pharmacies = await Queries.getPharmacies_PharmaciesFilters(idDistrict,idRegion, null)
    filters.districts = await Queries.getPharmacies_DistrictsFilters(idPharmacy,idRegion, null)
    filters.regions = await Queries.getPharmacies_RegionsFilters(idPharmacy,idDistrict, null) 

    // Add missing default option 
    filters.pharmacies.unshift(default_filter)
    filters.districts.unshift(default_filter)
    filters.regions.unshift(default_filter)

    res.status(200).json({ data, filters });
  }
  catch (err) {
    res.status(501).json({error: err, msg: "Error obtaining pharmacies table"});
  }
});





/*    GET pharmacy by id   */
// Route responsible for retrieving a pharmacy's details
//Return:
router.get('/farmacias/detalhes/:idPharmacy', async function(req, res, next) {
  let pharmacy_raw = {}

  const pharmacy = {
    Nome: '',
    Distrito: '',
    Regiao: '',
    Freguesia: '',       // Not required                                  
    Rua: '',
    Codigo_postal: '',
    Edificio: '',        // Not required
    Telefone: '',                         
    Email: '',           // Not required
    Representante: '',
    Estado: [],
    Notas: '',           // Not required             
    Produtos: []         // Not required 
  }

  const idPharmacy = parseInt(req.params.idPharmacy)

  try {    
    pharmacy_raw = await Queries.getPharmacyById(idPharmacy)
    const address = parseAddress(pharmacy_raw.address)
    
    pharmacy.Nome = pharmacy_raw.pharmacy
    pharmacy.Distrito = pharmacy_raw.district
    pharmacy.Regiao = pharmacy_raw.region
    pharmacy.Freguesia = pharmacy_raw.town
    pharmacy.Rua = address.Rua
    pharmacy.Codigo_postal = address.Codigo_Postal
    pharmacy.Edificio = address.Edificio
    pharmacy.Representante = pharmacy_raw.representative
    pharmacy.Telefone = pharmacy_raw.phone
    pharmacy.Email = pharmacy_raw.email
    pharmacy.Estado.push(pharmacy_raw.state)
    pharmacy.Notas = pharmacy_raw.notes
    // pharmacy.Produtos = 'AAAAAAA'

    res.status(200).json(pharmacy);
  } catch (err) {
    res.status(501).json({error: err, msg: "Error obtaining pharmacy's details"});
  }  
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
