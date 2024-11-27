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
                SUM("2018") AS "2018", 
                SUM("2019") AS "2019",
                SUM("2020") AS "2020",
                SUM("2021") AS "2021",
                SUM("2022") AS "2022",
                SUM("2023") AS "2023",
                SUM("2024") AS "2024"
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
    let query = `SELECT ROW_NUMBER() OVER () -1 as key,  product_name, SUM(jan) AS jan,
            SUM(feb) AS feb, SUM(mar) AS mar, SUM(apr) AS apr, SUM(may) AS may,
            SUM(jun) AS jun, SUM(jul) AS jul, SUM(aug) AS aug, SUM(sep) AS sep,
            SUM(oct) AS oct, SUM(nov) AS nov, SUM (dec) AS dec
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
    let query = `SELECT ROW_NUMBER() OVER () -1 as key, brick, SUM(jan) AS jan,
                  SUM(feb) AS feb, SUM(mar) AS mar, SUM(apr) AS apr, SUM(may) AS may,
                  SUM(jun) AS jun, SUM(jul) AS jul, SUM(aug) AS aug, SUM(sep) AS sep,
                  SUM(oct) AS oct, SUM(nov) AS nov, SUM (dec) AS dec
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

module.exports.getTableDelegates = async (idDelegate,idDistrict,idRegion) => {
  try {
    
    idDelegate = Number.isInteger(idDelegate) ? parseInt(idDelegate) : null;
    idDistrict = Number.isInteger(idDistrict) ? parseInt(idDistrict) : null;
    idRegion = Number.isInteger(idRegion) ? parseInt(idRegion) : null;
    console.log("delegatesssss :",idDelegate)
    console.log("districtsssss :",idDistrict)
    console.log("regioessssssss :",idRegion)
    const results = await db.query(`SELECT DISTINCT ROW_NUMBER() OVER () -1 as key, 
                                    id_delegate, 
                                    delegate AS delegate_name, 
                                    brick, district, region, 
                                    parish AS town, 
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

module.exports.getDelegatesFilters = async (tableName, idDelegate, idRegion) => {
  try {    

    // Verificar se o nome da tabela é válido (segurança contra injeção SQL)
    const validTables = ['general_delegates_and_bricks'];
    if (!validTables.includes(tableName)) {
      throw new Error('Invalid table name');
    }

    idDelegate = Number.isInteger(idDelegate) ? parseInt(idDelegate) : null;
    idRegion = Number.isInteger(idRegion) ? parseInt(idRegion) : null;
    
    const results = await db.query(`SELECT DISTINCT 
                                      id_delegate AS value, 
                                      delegate AS label
                                      FROM ${tableName}
                                      WHERE (id_delegate = $1 OR $1 IS NULL) 
                                      AND (id_region = $2 OR $2 IS NULL) 
                                      ORDER BY label ASC;`, [idDelegate, idRegion]);
    console.log("COISSSASS AQUIOO",JSON.stringify(results.rows,null,2))
    return results.rows;
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining delegates filters.');
  }
};

module.exports.getDistrictsFilters = async (tableName, idDelegate, idRegion) => {
  try {    

    // Verificar se o nome da tabela é válido (segurança contra injeção SQL)
    const validTables = ['general_delegates_and_bricks'];
    if (!validTables.includes(tableName)) {
      throw new Error('Invalid table name');
    }
    
    idDelegate = Number.isInteger(idDelegate) ? parseInt(idDelegate) : null;
    idRegion = Number.isInteger(idRegion) ? parseInt(idRegion) : null;                                                               
    
    const results = await db.query(`SELECT DISTINCT 
                                      id_district AS value, 
                                      district AS label 
                                      FROM ${tableName}
                                      WHERE (id_delegate = $1 OR $1 IS NULL) 
                                      AND (id_region = $2 OR $2 IS NULL) 
                                      ORDER BY label ASC;`, [idDelegate, idRegion]);
    console.log("COISSSASS AQUIOO",)
    return results.rows;
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining districts filters.');
  }
};

module.exports.getRegionsFilters = async (tableName, idDelegate, idDistrict) => {
  try {    

    // Verificar se o nome da tabela é válido (segurança contra injeção SQL)
    const validTables = ['general_delegates_and_bricks'];
    if (!validTables.includes(tableName)) {
      throw new Error('Invalid table name');
    }
    
    idDelegate = Number.isInteger(idDelegate) ? parseInt(idDelegate) : null;
    idDistrict = Number.isInteger(idDistrict) ? parseInt(idDistrict) : null;                                                               
    
    const results = await db.query(`SELECT DISTINCT 
                                      id_region AS value, 
                                      region AS label 
                                      FROM ${tableName}
                                      WHERE (id_delegate = $1 OR $1 IS NULL) 
                                      AND (id_district = $2 OR $2 IS NULL) 
                                      ORDER BY label ASC;`, [idDelegate, idDistrict]);
    console.log("COISSSASS AQUIOO",)
    return results.rows;
  } catch (err) {
    console.log("ERROR: ", err)
    throw new Error('Error obtaining delegates filters.');
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

module.exports.getSpecialties = async () => {
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
    console.log("idDelegate dentro de getPharmacies: ",idDelegate)                                  

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

// Add delegate
// TODO - NOT TESTED 
// TODO - adicionar contacto
module.exports.createDelegate= (res, req) => {
  const { del } = req.body;
  db.query('INSERT INTO delegate (name, registry_date, state, fk_id_contact) VALUES (?, ?, ?, ?)', [del.name, del.registry_date, true, del.fk_id_contact], (err,results) => {
    if (err) {
      res.status(503).json({error: err, msg: "Could not add new Delegate"});
    }
    res.status(201).json({msg: "Delegate successfully added with ID: ${results.insertId}"})
  })
}


// Obtain delegate by id 
// TODO - NOT TESTED 
module.exports.getDelegateById = (delegate_id, res, req) => {
  db.query('SELECT * FROM delegate WHERE id = ?', [delegate_id], (err,results) => {
    if (err) {
      res.status(504).json({error: err, msg: "Could not obtain Delegate with ID: ${delegate_id}"});
    }
    res.status(200).json(results.rows)
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




