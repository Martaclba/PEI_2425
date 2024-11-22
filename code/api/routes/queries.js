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
    year = Number.isInteger(year) ? Number(year) : null;
    let query = `SELECT delegate_name, id_delegate,
          SUM(jan) AS jan, SUM(feb) AS feb, SUM(mar) AS mar, 
          SUM(apr) AS apr, SUM(may) AS may, SUM(jun) AS jun, 
          SUM(jul) AS jul, SUM(aug) AS aug, SUM(sep) AS sep, 
          SUM(oct) AS oct, SUM(nov) AS nov, SUM(dec) AS dec
          FROM general_table
          WHERE (id_delegate = $1 OR $1 IS NULL) AND (year = $2 OR $2 IS NULL) AND (company_name = 'Farma 1000' OR 'Farma 1000' IS NULL)
          GROUP BY id_delegate, delegate_name, company_name, year;`
    const results = await db.query(query, [idDelegate,year]);
    return results.rows;
  } catch (err) {
    return [{error:err, msg:'Error obtaining sales histogram'}]
  }
};

module.exports.getSaleTotalProducts = async (idDelegate, idCompany, idBrick, idProduct) => {
  try {
    idDelegate = Number.isInteger(idDelegate) ? parseInt(idDelegate) : null;
    idCompany = Number.isInteger(idCompany) ? parseInt(idCompany) : null;
    idBrick = Number.isInteger(idBrick) ? parseInt(idBrick) : null;
    idProduct = Number.isInteger(idProduct) ? parseInt(idProduct) : null;
    let query = `SELECT product_cnp, product_name, SUM(2018) AS 2018, 
                SUM(2019) AS 2019, SUM(2020) AS 2020, SUM(2021) AS 2021, SUM(2022) AS 2022,
                SUM(2023) AS 2023, SUM(2024) AS 2024
                FROM general_table_per_year
                WHERE (id_delegate = $1 OR $1 IS NULL)
                AND (company_name = $2 OR $2 IS NULL)
                AND (brick = $3 OR $3 IS NULL)
                AND (product_cnp = $4 OR $4 IS NULL)
                GROUP BY id_delegate, company_name, brick, product_name, product_cnp`
    const results = await db.query(query, [idDelegate, idCompany, idBrick, idProduct]);
    return results.rows;
  } catch (err) {
    return [{error:err, msg:'Error obtaining total yearly sales by product'}]
  }
};

module.exports.getSaleProducts = async (idDelegate, year, idCompany, idBrick, idProduct) => {
  try {
    console.log(`\n [][][][][] [Inicial] [][][][][] \n idDelegate: ${idDelegate}\n year: ${year}\n idCompany: ${idCompany}\n idBrick: ${idBrick}\n idProduct: ${idProduct}\nn`)
    idDelegate = Number.isInteger(idDelegate) ? parseInt(idDelegate) : null;
    year = Number.isInteger(year) ? Number(year) : null;
    idCompany = Number.isInteger(idCompany) ? parseInt(idCompany) : null;
    idBrick = Number.isInteger(idBrick) ? parseInt(idBrick) : null;
    idProduct = Number.isInteger(idProduct) ? parseInt(idProduct) : null;
    let query = `SELECT product_cnp, product_name, SUM(jan) AS jan,
            SUM(feb) AS feb, SUM(mar) AS mar, SUM(apr) AS apr, SUM(may) AS may,
            SUM(jun) AS jun, SUM(jul) AS jul, SUM(aug) AS aug, SUM(sep) AS sep,
            SUM(oct) AS oct, SUM(nov) AS nov, SUM (dec) AS dec
            FROM general_table
            WHERE (id_delegate = $1 OR $1 IS NULL)
            AND (year = $2 OR $2 IS NULL)
            AND (company_name = $3 OR $3 IS NULL)
            AND (brick = $4 OR $4 IS NULL)
            AND (product_cnp = $5 OR $5 IS NULL)
            GROUP BY id_delegate, year, company_name, brick, product_cnp, product_name`
    const results = await db.query(query, [idDelegate, year, idCompany, idBrick, idProduct]);

    console.log(`\n [][][][][] [FINAL] [][][][][] \n idDelegate: ${idDelegate}\n year: ${year}\n idCompany: ${idCompany}\n idBrick: ${idBrick}\n idProduct: ${idProduct}\n`)

    return results.rows;
  } catch (err) {
    return [{error:err, msg:'Error obtaining sales by products.'}]
  }
};

module.exports.getSaleBricks = async (idDelegate, year, idCompany, idBrick) => {
  try {
    idDelegate = Number.isInteger(idDelegate) ? parseInt(idDelegate) : null;
    year = Number.isInteger(year) ? Number(year) : null;
    idCompany = Number.isInteger(idCompany) ? parseInt(idCompany) : null;
    idBrick = Number.isInteger(idBrick) ? parseInt(idBrick) : null;
    let query = `SELECT brick, SUM(jan) AS jan,
                  SUM(feb) AS feb, SUM(may) AS may, SUM(apr) AS abr, SUM(may) AS mai,
                  SUM(jun) AS jun, SUM(jul) AS jul, SUM(aug) AS ago, SUM(sep) AS set,
                  SUM(oct) AS out, SUM(nov) AS nov, SUM (dec) AS dez
                  FROM general_table
                  WHERE (id_delegate = $1 OR $1 IS NULL)
                  AND (year = $2 OR $2 IS NULL)
                  AND (company_name = $3 OR $3 IS NULL)
                  AND (brick = $4 OR $4 IS NULL)
                  GROUP BY id_delegate, year, company_name, brick`
    const results = await db.query(query, [idDelegate, year, idCompany, idBrick]);
    return results.rows;
  } catch (err) {
    return [{error:err, msg:'Error obtaining sales by bricks.'}]
  }
};

module.exports.getDelegates = async (year, idCompany, idBrick, idProduct) => {
  try {
    
    year = Number.isInteger(year) ? Number(year) : null;
    idCompany = Number.isInteger(idCompany) ? parseInt(idCompany) : null;
    idBrick = Number.isInteger(idBrick) ? parseInt(idBrick) : null;
    idProduct = Number.isInteger(idProduct) ? parseInt(idProduct) : null;                                                                    // Eu ainda nao tenho nas vistas company com id por isso para ja fica apenas o nome
    const results = await db.query('SELECT DISTINCT id_delegate, delegate_name FROM general_table WHERE (year = $1 OR $1 IS NULL) AND (company_name = $2 OR $2 IS NULL) AND (brick = $3 OR $3 IS NULL) AND (product_cnp = $4 OR $4 IS NULL);', [year, idCompany, idBrick, idProduct]);
    return results.rows;
  } catch (err) {
    return {error:err, msg:'Error obtaining delegates.'}
  }
};

module.exports.getYears = async (idDelegate,idCompany,idBrick,idProduct) => {
  try {
    idDelegate = Number.isInteger(idDelegate) ? parseInt(idDelegate) : null;
    idCompany = Number.isInteger(idCompany) ? parseInt(idCompany) : null;
    idBrick = Number.isInteger(idBrick) ? parseInt(idBrick) : null;
    idProduct = Number.isInteger(idProduct) ? parseInt(idProduct) : null;                                                           // Eu ainda nao tenho nas vistas company com id por isso para ja fica apenas o nome
    const results = await db.query('SELECT DISTINCT year FROM general_table WHERE (id_delegate = $1 OR $1 IS NULL) AND (company_name = $2 OR $2 IS NULL) AND (brick = $3 OR $3 IS NULL) AND (product_cnp = $4 OR $4 IS NULL);', [idDelegate, idCompany, idBrick, idProduct]);
    return results.rows;
  } catch (err) {
    return {error:err, msg:'Error obtaining years.'}
  }
};

module.exports.getCompanies = async (idDelegate, year, idBrick, idProduct) => {
  try {
    idDelegate = Number.isInteger(idDelegate) ? parseInt(idDelegate) : null;
    year = Number.isInteger(year) ? Number(year) : null;
    idBrick = Number.isInteger(idBrick) ? parseInt(idBrick) : null;
    idProduct = Number.isInteger(idProduct) ? parseInt(idProduct) : null;
    const results = await db.query('SELECT DISTINCT company_name FROM general_table WHERE (id_delegate = $1 OR $1 IS NULL) AND (year = $2 OR $2 IS NULL) AND (brick = $3 OR $3 IS NULL) AND (product_cnp = $4 OR $4 IS NULL);', [idDelegate, year, idBrick, idProduct]);
    return results.rows;
  } catch (err) {
    return {error:err, msg:'Error obtaining companies.'}
  }
};

module.exports.getBricks = async (idDelegate,year,idCompany,idProduct) => {
  try {
    idDelegate = Number.isInteger(idDelegate) ? parseInt(idDelegate) : null;
    year = Number.isInteger(year) ? Number(year) : null;
    idCompany = Number.isInteger(idCompany) ? parseInt(idCompany) : null;
    idProduct = Number.isInteger(idProduct) ? parseInt(idProduct) : null;
    const results = await db.query('SELECT DISTINCT brick FROM general_table WHERE (id_delegate = $1 OR $1 IS NULL) AND (year = $2 OR $2 IS NULL) AND (company_name = $3 OR $3 IS NULL) AND (product_cnp = $4 OR $4 IS NULL);', [idDelegate, year, idCompany, idProduct]);
    return results.rows;
  } catch (err) {
    return {error:err, msg:'Error obtaining bricks.'}
  }
};

module.exports.getProducts = async (idDelegate,year,idCompany,idBrick) => {
  try {
    idDelegate = Number.isInteger(idDelegate) ? parseInt(idDelegate) : null;
    year = Number.isInteger(year) ? Number(year) : null;
    idCompany = Number.isInteger(idCompany) ? parseInt(idCompany) : null;
    idBrick = Number.isInteger(idBrick) ? parseInt(idBrick) : null;
    const results = await db.query('SELECT DISTINCT product_cnp, product_name FROM general_table WHERE (id_delegate = $1 OR $1 IS NULL) AND (year = $2 OR $2 IS NULL) AND (company_name = $3 OR $3 IS NULL) AND (brick = $4 OR $4 IS NULL);', [idDelegate, year, idCompany, idBrick]);
    return results.rows;
  } catch (err) {
    return {error:err, msg:'Error obtaining products.'}
  }
};


// QUERY TEST
// IGNORE
module.exports.getTowns = async () => {
  try {
    const results = await db.query('SELECT * FROM town ORDER BY id_town ASC');
    return results.rows;
  } catch (err) {
    throw err;
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
// TODO - NOT TESTED
module.exports.createVisit = (res, req) => {
  const { visit } = req.body;

  db.query('INSERT INTO visit (date, visit_state, fk_Brick, fk_doctor, fk_pharmacy) VALUES (?, ?, ?, ?, ?)', [visit.date, visit.visit_state, visit.fk_Brick, visit.fk_doctor, visit.fk_pharmacy], (err,results) => {
    if (err) {
      res.status(521).json({error: err, msg: "Could not add new Visit"});
    }
    res.status(201).json({msg: "Visit successfully added with ID: ${results.insertId}"})
  })
}




