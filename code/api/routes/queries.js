const { Client } = require('pg')
const dbconf = require('../config/postgresql.cfg')

const db = new Client({
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


// ESTA É A BASE DAS QUERIES ---- deste estilo
module.exports.getSaleHistogram = async (idDelegate, year) => {
  try {
    idDelegate = Number.isInteger(idDelegate) ? parseInt(idDelegate) : null;
    year = Number.isInteger(parseInt(year)) ? parseInt(year) : null;
    let query = `SELECT
                        SUM(jan) AS jan, SUM(feb) AS feb, SUM(mar) AS mar, 
                        SUM(apr) AS apr, SUM(may) AS may, SUM(jun) AS jun, 
                        SUM(jul) AS jul, SUM(aug) AS aug, SUM(sep) AS sep, 
                        SUM(oct) AS oct, SUM(nov) AS nov, SUM(dec) AS dec
                        FROM general_table
                        WHERE (id_delegate = $1 OR $1 IS NULL) AND (year = $2 OR $2 IS NULL) AND (company_name = 'MyPharma');`
    
    const results = await db.query(query, [idDelegate,year]);
    
    const row = results.rows[0];
    if (row) {
      const monthlySums = Object.entries(row).map(([month, value]) => ({
        month: month,
        value: parseInt(value, 10) // Convert value to a number if necessary
      }));
      return monthlySums;
    } else {
      return [];
    }
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining sales histogram.');
  }
};

module.exports.getSaleTotalProducts = async (idDelegate, idCompany, idBrick, idProduct) => {
  try {
    idDelegate = Number.isInteger(idDelegate) ? parseInt(idDelegate) : null;
    idCompany = Number.isInteger(idCompany) ? parseInt(idCompany) : null;
    companyName = idCompany === null ? 'MyPharma' : null;
    idBrick = Number.isInteger(idBrick) ? parseInt(idBrick) : null;
    idProduct = Number.isInteger(idProduct) ? parseInt(idProduct) : null;
    let query = `SELECT ROW_NUMBER() OVER () -1 as key, product_name,
                CAST(SUM("2018") AS INT) AS "2018", 
                CAST(SUM("2019") AS INT) AS "2019",
                CAST(SUM("2020") AS INT) AS "2020",
                CAST(SUM("2021") AS INT) AS "2021",
                CAST(SUM("2022") AS INT) AS "2022",
                CAST(SUM("2023") AS INT) AS "2023",
                CAST(SUM("2024") AS INT) AS "2024"
                FROM general_table_per_years
                WHERE (id_delegate = $1 OR $1 IS NULL)
                AND (company_id = $2 OR $2 IS NULL)
                AND (brick = $3 OR $3 IS NULL)
                AND (product_cnp = $4 OR $4 IS NULL)
                AND (company_name = $5 OR $5 IS NULL)
                GROUP BY product_cnp, product_name`
    const results = await db.query(query, [idDelegate, idCompany, idBrick, idProduct, companyName]);
    return results.rows;
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining total yearly sales by product.');
  }
};

module.exports.getSaleProducts = async (idDelegate, year, idCompany, idBrick, idProduct) => {
  try {
    idDelegate = Number.isInteger(idDelegate) ? parseInt(idDelegate) : null;
    year = Number.isInteger(parseInt(year)) ? parseInt(year) : 2024;
    idCompany = Number.isInteger(idCompany) ? parseInt(idCompany) : null;
    companyName = idCompany === null ? 'MyPharma' : null;
    idBrick = Number.isInteger(idBrick) ? parseInt(idBrick) : null;
    idProduct = Number.isInteger(idProduct) ? parseInt(idProduct) : null;
    let query = `SELECT ROW_NUMBER() OVER () -1 as key,  product_name, CAST(SUM(jan) AS INT) AS jan,
             CAST(SUM(feb) AS INT) AS feb, CAST(SUM(mar) AS INT) AS mar, CAST(SUM(apr) AS INT) AS apr, CAST(SUM(may) AS INT) AS may,
             CAST(SUM(jun) AS INT) AS jun, CAST(SUM(jul) AS INT) AS jul, CAST(SUM(aug) AS INT) AS aug, CAST(SUM(sep) AS INT) AS sep,
             CAST(SUM(oct) AS INT) AS oct, CAST(SUM(nov) AS INT) AS nov, CAST(SUM(dec) AS INT) AS dec
            FROM general_table
            WHERE (id_delegate = $1 OR $1 IS NULL)
            AND (year = $2 OR $2 IS NULL)
            AND (company_id = $3 OR $3 IS NULL)
            AND (brick = $4 OR $4 IS NULL)
            AND (product_cnp = $5 OR $5 IS NULL)
            AND (company_name = $6 OR $6 IS NULL)
            GROUP BY product_cnp, product_name`
    const results = await db.query(query, [idDelegate, year, idCompany, idBrick, idProduct, companyName]);

    return results.rows;
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining sales by products.');
  }
};

module.exports.getSaleBricks = async (idDelegate, year, idCompany, idBrick) => {
  try {
    idDelegate = Number.isInteger(idDelegate) ? parseInt(idDelegate) : null;
    year = Number.isInteger(parseInt(year)) ? parseInt(year) : null;
    idCompany = Number.isInteger(idCompany) ? parseInt(idCompany) : null;
    companyName = idCompany === null ? 'MyPharma' : null;
    idBrick = Number.isInteger(idBrick) ? parseInt(idBrick) : null;
    let query = `SELECT ROW_NUMBER() OVER () -1 as key, brick, CAST(SUM(jan) AS INT) AS jan,
                    CAST(SUM(feb) AS INT) AS feb, CAST(SUM(mar) AS INT) AS mar, CAST(SUM(apr) AS INT) AS apr, CAST(SUM(may) AS INT) AS may,
                    CAST(SUM(jun) AS INT) AS jun, CAST(SUM(jul) AS INT) AS jul, CAST(SUM(aug) AS INT) AS aug,  CAST(SUM(sep) AS INT) AS sep,
                    CAST(SUM(oct) AS INT) AS oct, CAST(SUM(nov) AS INT) AS nov, CAST(SUM(dec) AS INT) AS dec
                  FROM general_table
                  WHERE (id_delegate = $1 OR $1 IS NULL)
                  AND (year = $2 OR $2 IS NULL)
                  AND (company_id = $3 OR $3 IS NULL)
                  AND (brick = $4 OR $4 IS NULL)
                  AND (company_name = $5 OR $5 IS NULL)
                  GROUP BY brick`
    const results = await db.query(query, [idDelegate, year, idCompany, idBrick, companyName]);
    return results.rows;
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining sales by bricks.');
  }
};

module.exports.getDelegates = async (year, idCompany, idBrick, idProduct) => {
  try {
    
    year = Number.isInteger(parseInt(year)) ? parseInt(year) : null;
    idCompany = Number.isInteger(idCompany) ? parseInt(idCompany) : null;
    idBrick = Number.isInteger(idBrick) ? parseInt(idBrick) : null;
    idProduct = Number.isInteger(idProduct) ? parseInt(idProduct) : null;                                                                    // Eu ainda nao tenho nas vistas company com id por isso para ja fica apenas o nome
    const results = await db.query('SELECT DISTINCT id_delegate as value, delegate_name as label FROM general_table WHERE (year = $1 OR $1 IS NULL) AND (company_id = $2 OR $2 IS NULL) AND (brick = $3 OR $3 IS NULL) AND (product_cnp = $4 OR $4 IS NULL) ORDER BY label ASC;', [year, idCompany, idBrick, idProduct]);
    return results.rows;
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining delegates.');
  }
};

module.exports.getYears = async (idDelegate,idCompany,idBrick,idProduct) => {
  try {
    idDelegate = Number.isInteger(idDelegate) ? parseInt(idDelegate) : null;
    idCompany = Number.isInteger(idCompany) ? parseInt(idCompany) : null;
    idBrick = Number.isInteger(idBrick) ? parseInt(idBrick) : null;
    idProduct = Number.isInteger(idProduct) ? parseInt(idProduct) : null;                                                           // Eu ainda nao tenho nas vistas company com id por isso para ja fica apenas o nome
    const results = await db.query('SELECT DISTINCT year as value FROM general_table WHERE (id_delegate = $1 OR $1 IS NULL) AND (company_id = $2 OR $2 IS NULL) AND (brick = $3 OR $3 IS NULL) AND (product_cnp = $4 OR $4 IS NULL) ORDER BY value ASC;', [idDelegate, idCompany, idBrick, idProduct]);
    return results.rows;
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining years.');
  }
};

module.exports.getCompanies = async (idDelegate, year, idBrick, idProduct) => {
  try {
    idDelegate = Number.isInteger(idDelegate) ? parseInt(idDelegate) : null;
    year = Number.isInteger(parseInt(year)) ? parseInt(year) : null;
    idBrick = Number.isInteger(idBrick) ? parseInt(idBrick) : null;
    idProduct = Number.isInteger(idProduct) ? parseInt(idProduct) : null;
    const results = await db.query('SELECT DISTINCT company_name AS label, company_id AS value FROM general_table WHERE (id_delegate = $1 OR $1 IS NULL) AND (year = $2 OR $2 IS NULL) AND (brick = $3 OR $3 IS NULL) AND (product_cnp = $4 OR $4 IS NULL) ORDER BY label ASC;', [idDelegate, year, idBrick, idProduct]);
    return results.rows;
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining companies.');
  }
};

module.exports.getBricks = async (idDelegate,year,idCompany,idProduct) => {
  try {
    idDelegate = Number.isInteger(idDelegate) ? parseInt(idDelegate) : null;
    year = Number.isInteger(parseInt(year)) ? parseInt(year) : null;
    idCompany = Number.isInteger(idCompany) ? parseInt(idCompany) : null;
    idProduct = Number.isInteger(idProduct) ? parseInt(idProduct) : null;
    const results = await db.query('SELECT DISTINCT brick as value FROM general_table WHERE (id_delegate = $1 OR $1 IS NULL) AND (year = $2 OR $2 IS NULL) AND (company_id = $3 OR $3 IS NULL) AND (product_cnp = $4 OR $4 IS NULL) ORDER BY value ASC;', [idDelegate, year, idCompany, idProduct]);
    return results.rows;
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining bricks.');
  }
};

module.exports.getProducts = async (idDelegate,year,idCompany,idBrick) => {
  try {
    idDelegate = Number.isInteger(idDelegate) ? parseInt(idDelegate) : null;
    year = Number.isInteger(parseInt(year)) ? parseInt(year) : null;
    idCompany = Number.isInteger(idCompany) ? parseInt(idCompany) : null;
    idBrick = Number.isInteger(idBrick) ? parseInt(idBrick) : null;
    const results = await db.query('SELECT DISTINCT product_cnp as value, product_name as label FROM general_table WHERE (id_delegate = $1 OR $1 IS NULL) AND (year = $2 OR $2 IS NULL) AND (company_id = $3 OR $3 IS NULL) AND (brick = $4 OR $4 IS NULL) ORDER BY label ASC;', [idDelegate, year, idCompany, idBrick]);
    return results.rows;
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining products.');
  }
};


module.exports.getDistricts = async () => {
  try {
    const results = await db.query('SELECT DISTINCT id_district as value, name as label FROM district ORDER BY label ASC;', []);
    return results.rows;
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining districts.');
  }
};


module.exports.getRegions = async () => {
  try {                                               
    const results = await db.query('SELECT DISTINCT id_region as value, name as label FROM region ORDER BY label ASC;', []);
    return results.rows;
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining regions.');
  }
};

module.exports.getTowns = async () => {
  try {
    const results = await db.query('SELECT DISTINCT id_town as value, name as label FROM town ORDER BY label ASC;', []);
    return results.rows;
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining towns.');
  }
};

module.exports.getInstitutions = async () => {
  try {
    const results = await db.query('SELECT DISTINCT id_institution as value, name as label FROM institution ORDER BY label ASC;', []);
    return results.rows;
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining institutions.');
  }
};

module.exports.getSpecialities = async () => {
  try {
    const results = await db.query('SELECT DISTINCT id_specialty as value, name as label FROM specialty ORDER BY label ASC;', []);
    return results.rows;
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining specialties.');
  }
};

module.exports.getDoctors = async (idDelegate) => {
  try {
    idDelegate = Number.isInteger(idDelegate) ? parseInt(idDelegate) : null;
    const results = await db.query(`SELECT 
                                        gd.id_doctor AS value,
                                        gd.medico AS label
                                    FROM 
                                        general_doctors gd
                                    WHERE 
                                        gd.brick IN (
                                            SELECT hz.brick 
                                            FROM general_delegates_and_bricks hz 
                                            WHERE hz.id_delegate = $1
                                        )
                                    ORDER BY 
                                        gd.medico ASC;
                                `, [idDelegate]);
    return results.rows;
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining doctors.');
  }
};

module.exports.getPharmacies = async (idDelegate) => {
  try {
    idDelegate = Number.isInteger(idDelegate) ? parseInt(idDelegate) : null;                                                

    const results  = await db.query(`SELECT 
                                        gp.id_pharmacy AS value,
                                        gp.pharmacy AS label
                                    FROM 
                                        general_pharmacies gp
                                    WHERE 
                                        gp.brick IN (
                                            SELECT hz.brick 
                                            FROM general_delegates_and_bricks hz 
                                            WHERE hz.id_delegate = $1
                                        )
                                    ORDER BY 
                                        gp.pharmacy ASC;`, [idDelegate]);
    return results.rows;
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining pharmacies.');
  }
};



module.exports.getTableDelegates = async (idDelegate,idDistrict,idRegion) => {
  try {
    
    idDelegate = Number.isInteger(idDelegate) ? parseInt(idDelegate) : null;
    idDistrict = Number.isInteger(idDistrict) ? parseInt(idDistrict) : null;
    idRegion = Number.isInteger(idRegion) ? parseInt(idRegion) : null;

    const results = await db.query(`SELECT DISTINCT ROW_NUMBER() OVER () -1 as key, 
                                    id_delegate, 
                                    delegate AS delegate_name, 
                                    brick, district, region, 
                                    COALESCE(parish, '') AS town, 
                                    state 
                                        FROM general_delegates_and_bricks
                                        WHERE (id_delegate = $1 OR $1 IS NULL) 
                                        AND (id_district = $2 OR $2 IS NULL) 
                                        AND (id_region = $3 OR $3 IS NULL) 
                                    ORDER BY delegate_name ASC;`, [idDelegate, idDistrict, idRegion]);
      return results.rows;
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining delegates table.');
  }
};
// TINHA UMA CENA MAL AQUI. idDelegate em vez de idDistrict
module.exports.getDelegates_DelegatesFilters = async (idDistric, idRegion) => {
  try {    
    idDistric = Number.isInteger(idDistric) ? parseInt(idDistric) : null;
    idRegion = Number.isInteger(idRegion) ? parseInt(idRegion) : null;
    
    const results = await db.query(`SELECT DISTINCT 
                                      id_delegate AS value, 
                                      delegate AS label
                                      FROM general_delegates_and_bricks
                                      WHERE (id_district = $1 OR $1 IS NULL) 
                                      AND (id_region = $2 OR $2 IS NULL) 
                                      ORDER BY label ASC;`, [idDistric, idRegion]);
    return results.rows;
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining delegates filters.');
  }
};

module.exports.getDelegates_DistrictsFilters = async (idDelegate, idRegion) => {
  try {      
    idDelegate = Number.isInteger(idDelegate) ? parseInt(idDelegate) : null;
    idRegion = Number.isInteger(idRegion) ? parseInt(idRegion) : null;                                                               
    
    const results = await db.query(`SELECT DISTINCT 
                                      id_district AS value, 
                                      district AS label 
                                      FROM general_delegates_and_bricks
                                      WHERE (id_delegate = $1 OR $1 IS NULL) 
                                      AND (id_region = $2 OR $2 IS NULL) 
                                      ORDER BY label ASC;`, [idDelegate, idRegion]);
    return results.rows;
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining delegates districts filters.');
  }
};

module.exports.getDelegates_RegionsFilters = async (idDelegate, idDistrict) => {
  try {        
    idDelegate = Number.isInteger(idDelegate) ? parseInt(idDelegate) : null;
    idDistrict = Number.isInteger(idDistrict) ? parseInt(idDistrict) : null;                                                               
    
    const results = await db.query(`SELECT DISTINCT 
                                      id_region AS value, 
                                      region AS label 
                                      FROM general_delegates_and_bricks
                                      WHERE (id_delegate = $1 OR $1 IS NULL) 
                                      AND (id_district = $2 OR $2 IS NULL) 
                                      ORDER BY label ASC;`, [idDelegate, idDistrict]);
    return results.rows;
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining delegates regions filters.');
  }
};

module.exports.createDelegate = async (delegate) => {
  
  // Optional fields
  const town = delegate.Freguesia? delegate.Freguesia : null;
  
  // 
  const name = delegate.Primeiro + delegate.Ultimo;
  const state = delegate.Estado[0].label
  // const registry_date = Date.now()

  try{
    const results = await db.query('INSERT INTO delegate (name, state) VALUES ($1, $2) RETURNING id_delegate;',  [name, state])
    
    // Access the generated ID from the result
    const id_delegate = results.rows[0].id_delegate;

    // const results2 = await db.query(`SELECT DISTINCT 
    //                                     id_region AS value, 
    //                                     region AS label 
    //                                     FROM general_delegates_and_bricks
    //                                     WHERE (id_delegate = $1 OR $1 IS NULL) 
    //                                   ORDER BY label ASC;`, [id_delegate]);

  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Could not add new delegate.');
  }
}

module.exports.getDelegateById = async (brick) => {
  
  try {
    const result = await db.query(`SELECT  
                                    delegate, district, 
                                    region, COALESCE(parish, '') AS town, state
                                    FROM general_delegates_and_bricks 
                                    WHERE brick = $1`, 
                                  [brick])

    return result.rows[0]
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining delegate.');
  }
}



module.exports.getTablePharmacies = async (idPharmacy,idDistrict,idRegion, idDelegate) => {
  try {
    
    idPharmacy = Number.isInteger(idPharmacy) ? parseInt(idPharmacy) : null;
    idDistrict = Number.isInteger(idDistrict) ? parseInt(idDistrict) : null;
    idRegion = Number.isInteger(idRegion) ? parseInt(idRegion) : null;
    idDelegate = Number.isInteger(idDelegate) ? parseInt(idDelegate) : null;

    const results = await db.query(`SELECT DISTINCT ROW_NUMBER() OVER () -1 as key, 
                                    id_pharmacy, 
                                    pharmacy AS pharmacy_name, 
                                    brick, district, region, 
                                    COALESCE(parish, '') AS town, 
                                    address 
                                        FROM general_pharmacies AS gp
                                        WHERE 
                                        gp.brick IN (
                                          SELECT hz.brick 
                                          FROM general_delegates_and_bricks hz 
                                          WHERE hz.id_delegate = $4 OR $4 IS NULL
                                        )
                                        AND (id_pharmacy = $1 OR $1 IS NULL) 
                                        AND (id_district = $2 OR $2 IS NULL) 
                                        AND (id_region = $3 OR $3 IS NULL)
                                    ORDER BY pharmacy_name ASC;`, [idPharmacy, idDistrict, idRegion, idDelegate]);
      return results.rows;
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining pharmacies table.');
  }
};

module.exports.getPharmacyById = async (idPharmacy) => {
  
  try {
    const result = await db.query(`SELECT DISTINCT 
                                    ROW_NUMBER() OVER () -1 AS key, 
                                    gp.pharmacy, 
                                    gp.district, 
                                    gp.region, 
                                    COALESCE(gp.parish, '') AS town, 
                                    gp.address, 
                                    p.state, 
                                    p.notes,
                                    r.name AS representative, 
                                    c.phone, 
                                    c.email
                                  FROM general_pharmacies gp
                                  JOIN pharmacy p ON gp.id_pharmacy = p.id_pharmacy
                                  JOIN representative r ON gp.id_representative = r.id_representative
                                  JOIN contact c ON r.fk_id_contact = c.id_contact
                                  WHERE gp.id_pharmacy = $1`, 
                                  
                                  [idPharmacy]);

      // console.log(result.rows)
      return result.rows[0];
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining pharmacies consult.');
  }
};

module.exports.getPharmacies_PharmaciesFilters = async (idDistrict, idRegion, idDelegate) => {
  try {    
    idDistrict = Number.isInteger(idDistrict) ? parseInt(idDistrict) : null;
    idRegion = Number.isInteger(idRegion) ? parseInt(idRegion) : null;
    idDelegate = Number.isInteger(idDelegate) ? parseInt(idDelegate) : null;

    const results = await db.query(`SELECT DISTINCT 
                                      id_pharmacy AS value, 
                                      pharmacy AS label
                                      FROM general_pharmacies AS gp
                                      WHERE
                                      gp.brick IN (
                                        SELECT hz.brick 
                                        FROM general_delegates_and_bricks hz 
                                        WHERE hz.id_delegate = $3 OR $3 IS NULL
                                      )
                                      AND (id_district = $1 OR $1 IS NULL) 
                                      AND (id_region = $2 OR $2 IS NULL) 
                                      ORDER BY label ASC;`, [idDistrict, idRegion, idDelegate]);
    return results.rows;
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining pharmacies filters.');
  }
};

module.exports.getPharmacies_DistrictsFilters = async (idPharmacy,idRegion, idDelegate) => {
  try {     
    idPharmacy = Number.isInteger(idPharmacy) ? parseInt(idPharmacy) : null; 
    idRegion = Number.isInteger(idRegion) ? parseInt(idRegion) : null;                                                               
    idDelegate = Number.isInteger(idDelegate) ? parseInt(idDelegate) : null;
    
    const results = await db.query(`SELECT DISTINCT 
                                      id_district AS value, 
                                      district AS label 
                                      FROM general_pharmacies AS gp
                                      WHERE
                                      gp.brick IN (
                                        SELECT hz.brick 
                                        FROM general_delegates_and_bricks hz 
                                        WHERE hz.id_delegate = $3 OR $3 IS NULL
                                      )
                                      AND (id_pharmacy = $1 OR $1 IS NULL) 
                                      AND (id_region = $2 OR $2 IS NULL) 
                                      ORDER BY label ASC;`, [idPharmacy,idRegion, idDelegate]);
    return results.rows;
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining pharmacies districts filters.');
  }
};

module.exports.getPharmacies_RegionsFilters = async (idPharmacy,idDistrict, idDelegate) => {
  try {        
    idPharmacy = Number.isInteger(idPharmacy) ? parseInt(idPharmacy) : null;
    idDistrict = Number.isInteger(idDistrict) ? parseInt(idDistrict) : null;                                                               
    idDelegate = Number.isInteger(idDelegate) ? parseInt(idDelegate) : null;
    
    const results = await db.query(`SELECT DISTINCT 
                                      id_region AS value, 
                                      region AS label 
                                      FROM general_pharmacies AS gp
                                      WHERE
                                      gp.brick IN (
                                        SELECT hz.brick 
                                        FROM general_delegates_and_bricks hz 
                                        WHERE hz.id_delegate = $3 OR $3 IS NULL
                                      )
                                      AND (id_pharmacy = $1 OR $1 IS NULL) 
                                      AND (id_district = $2 OR $2 IS NULL) 
                                      ORDER BY label ASC;`, [idPharmacy, idDistrict, idDelegate]);
    return results.rows;
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining pharmacies regions filters.');
  }
};



module.exports.getTableDoctors = async (idDoctor,idDistrict,idInstitution, idDelegate) => {
  try {
    
    idDoctor = Number.isInteger(idDoctor) ? parseInt(idDoctor) : null;
    idDistrict = Number.isInteger(idDistrict) ? parseInt(idDistrict) : null;
    idInstitution = Number.isInteger(idInstitution) ? parseInt(idInstitution) : null;
    idDelegate = Number.isInteger(idDelegate) ? parseInt(idDelegate) : null;
    
    const results = await db.query(`SELECT DISTINCT ROW_NUMBER() OVER () -1 as key, 
                                    id_doctor, 
                                    medico AS doctor_name, 
                                    brick, district, 
                                    institution, speciality AS specialty, state
                                        FROM general_doctors AS gd
                                        WHERE 
                                        gd.brick IN (
                                          SELECT hz.brick 
                                          FROM general_delegates_and_bricks hz 
                                          WHERE hz.id_delegate = $4 OR $4 IS NULL
                                        )
                                        AND (id_doctor = $1 OR $1 IS NULL) 
                                        AND (id_district = $2 OR $2 IS NULL) 
                                        AND (id_institution = $3 OR $3 IS NULL)
                                    ORDER BY doctor_name ASC;`, [idDoctor, idDistrict, idInstitution, idDelegate]);
      return results.rows;
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining doctors table.');
  }
};

module.exports.getDoctors_DoctorsFilters = async (idDistrict, idInstitution, idDelegate) => {
  try {    
    idDistrict = Number.isInteger(idDistrict) ? parseInt(idDistrict) : null;
    idInstitution = Number.isInteger(idInstitution) ? parseInt(idInstitution) : null;
    idDelegate = Number.isInteger(idDelegate) ? parseInt(idDelegate) : null;

    const results = await db.query(`SELECT DISTINCT 
                                      id_doctor AS value, 
                                      medico AS label
                                      FROM general_doctors AS gd
                                      WHERE 
                                        gd.brick IN (
                                          SELECT hz.brick 
                                          FROM general_delegates_and_bricks hz 
                                          WHERE hz.id_delegate = $3 OR $3 IS NULL
                                        )
                                      AND (id_district = $1 OR $1 IS NULL) 
                                      AND (id_institution = $2 OR $2 IS NULL) 
                                      ORDER BY label ASC;`, [idDistrict, idInstitution, idDelegate]);
    return results.rows;
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining doctors filters.');
  }
};

module.exports.getDoctors_DistrictsFilters = async (idDoctor,idInstitution, idDelegate) => {
  try {     
    idDoctor = Number.isInteger(idDoctor) ? parseInt(idDoctor) : null; 
    idInstitution = Number.isInteger(idInstitution) ? parseInt(idInstitution) : null;                                                               
    idDelegate = Number.isInteger(idDelegate) ? parseInt(idDelegate) : null;
    
    const results = await db.query(`SELECT DISTINCT 
                                      id_district AS value, 
                                      district AS label 
                                      FROM general_doctors AS gd
                                      WHERE 
                                        gd.brick IN (
                                          SELECT hz.brick 
                                          FROM general_delegates_and_bricks hz 
                                          WHERE hz.id_delegate = $3 OR $3 IS NULL
                                        )
                                      AND (id_doctor = $1 OR $1 IS NULL) 
                                      AND (id_institution = $2 OR $2 IS NULL) 
                                      ORDER BY label ASC;`, [idDoctor,idInstitution, idDelegate]);
    return results.rows;
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining doctors districts filters.');
  }
};

module.exports.getDoctors_InstitutionsFilters = async (idDoctor,idDistrict, idDelegate) => {
  try {        
    idDoctor = Number.isInteger(idDoctor) ? parseInt(idDoctor) : null;
    idDistrict = Number.isInteger(idDistrict) ? parseInt(idDistrict) : null;                                                               
    idDelegate = Number.isInteger(idDelegate) ? parseInt(idDelegate) : null;
    
    const results = await db.query(`SELECT DISTINCT 
                                      id_institution AS value, 
                                      institution AS label 
                                      FROM general_doctors AS gd
                                      WHERE 
                                        gd.brick IN (
                                          SELECT hz.brick 
                                          FROM general_delegates_and_bricks hz 
                                          WHERE hz.id_delegate = $3 OR $3 IS NULL
                                        )
                                      AND (id_doctor = $1 OR $1 IS NULL) 
                                      AND (id_district = $2 OR $2 IS NULL) 
                                      ORDER BY label ASC;`, [idDoctor, idDistrict, idDelegate]);
    return results.rows;
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining doctors regions filters.');
  }
};

module.exports.createDoctor = (doctor) => {
  
  // Optional fields
  const town = doctor.Freguesia || null
  const building = doctor.Edificio || null
  const email = doctor.Email || null
  const notes = doctor.Notas || null

  // Format address

  db.query(`INSERT INTO sale (notes, registry_date, fk_brick, fk_doctor, fk_pharmacy) 
            VALUES (?, ?, ?, ?, ?)`, 
            [doctor.notes, doctor.registry_date, doctor.fk_brick, doctor.fk_doctor, doctor.fk_pharmacy], 
      
  (err,results) => {  
    if (err) {
      console.log("ERROR: ", err)
      throw new Error('Could not add new doctor.');
    }
    // res.status(201).json({msg: "Doctor successfully added"})
  })
}

module.exports.getDoctorById = async (idDoctor) => {
  try {
    const result = await db.query(`SELECT DISTINCT 
                                    ROW_NUMBER() OVER () -1 AS key, 
                                    gd.medico,
                                    gd.institution,
                                    gd.speciality, 
                                    gd.district, 
                                    gd.full_address, 
                                    gd.state, 
                                    da.notes, 
                                    c.phone, 
                                    c.email,                                  
                                    d.name AS district,
                                    r.name AS region,
                                    t.name AS town
                                  FROM general_doctors gd
                                  JOIN doctor_activity da ON gd.id_doctor = da.fk_doctor
                                  JOIN contact c ON da.fk_id_contact = c.id_contact
                                  JOIN hmr_zone hmr ON gd.brick = hmr.brick
                                  JOIN district d ON hmr.fk_id_district = d.id_district
                                  JOIN region r ON hmr.fk_id_region = r.id_region
                                  JOIN town t ON hmr.fk_id_town = t.id_town
                                  WHERE gd.id_doctor = $1`, 
                                  
                                  [idDoctor]);

      console.log(result.rows)
      return result.rows[0];
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining doctors consult.');
  }
};


// ! - DEPRECATED BELOW

// TODO
// tratar de rollbacks quando uma query falha após outra
// adicionar parametros

// Obtain list of sales
module.exports.getSale = (res, req) => {
  db.query('SELECT * FROM sale ORDER BY id_sale ASC', (err,results) => {
    if (err) {
      res.status(500).json({error: err, msg: "Could not obtain list of Sales"});
    }
    res.status(200).json(results.rows)
  })
}

// Add sale
// TODO - NOT TESTED
module.exports.createSale= (res, req) => {
  const { sale } = req.body;

  db.query('INSERT INTO sale (notes, registry_date, fk_brick, fk_doctor, fk_pharmacy) VALUES (?, ?, ?, ?, ?)', [sale.notes, sale.registry_date, sale.fk_brick, sale.fk_doctor, sale.fk_pharmacy], (err,results) => {
    if (err) {
      res.status(501).json({error: err, msg: "Could not add new Sale"});
    }
    res.status(201).json({msg: "Sale successfully added with ID: ${results.insertId}"})
  })
}





// Update delegate by id
// TODO - NOT TESTED 
module.exports.updateDelegate= (delegate_id, res, req) => {
  const { del } = req.body;
  db.query('UPDATE delegate SET name = ?, state = ?, fk_id_contact = ? WHERE id = ?', [del.name, del.state, del.fk_id_contact, delegate_id], (err,results) => {
    if (err) {
      res.status(505).json({error: err, msg: "Could not update Delegate with ID: ${results.insertId}"});
    }
    res.status(200).json({msg: "Successfully updated Delegate with ID: ${results.insertId}"})
  })
}








// Obtain list of visits 
// TODO
module.exports.getVisits = (res, req) => {
  db.query('SELECT * FROM visit ORDER BY id ASC', (err,results) => {
    if (err) {
      res.status(520).json({error: err, msg: "Could not obtain list of Visits"});
    }
    res.status(200).json(results.rows)
  })
}

// Add visit
module.exports.createVisit = (visit) => {
  db.query('INSERT INTO visit (date, visit_state, fk_Brick, fk_doctor, fk_pharmacy) VALUES (?, ?, ?, ?, ?)', [visit.date, visit.visit_state, visit.fk_Brick, visit.fk_doctor, visit.fk_pharmacy], (err,results) => {
    if (err) {
      res.status(521).json({error: err, msg: "Could not add new Visit"});
    }
    res.status(201).json({msg: "Visit successfully added with ID: ${results.insertId}"})
  })
}




