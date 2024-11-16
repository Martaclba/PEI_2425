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

// Obtain list of delegates 
// TODO  - NOT TESTED 
module.exports.getDelegates = (res, req) => {
  db.query('SELECT * FROM delegate ORDER BY name ASC', (err,results) => {
    if (err) {
      res.status(502).json({error: err, msg: "Could not obtain list of Delegates"});
    }
    res.status(200).json(results.rows)
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


// QUERY TEST
// IGNORE
module.exports.getTowns = (res, req) => {
  db.query('SELECT * FROM town ORDER BY id_town ASC', (err,results) => {
    if (err) {
      res.status(500).json({error: err, msg: "ARDEU AMIGO"});
    }
    res.status(200).json(results.rows)
  })
}
