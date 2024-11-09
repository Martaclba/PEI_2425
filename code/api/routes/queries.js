// TODO
// tratar de rollbacks quando uma query falha após outra
// adicionar parametros

// Obtain list of sales 
// TODO  - NOT TESTED 
module.exports.getSale = (db, res, req) => {
  db.query('SELECT * FROM sale ORDER BY id ASC', (err,results) => {
    if (err) {
      throw res.status(500).json({error: err, msg: "Could not obtain list of Sales"});
    }
    res.status(200).json(results.rows)
  })
}

// Add sale
// TODO - NOT TESTED
module.exports.createSale= (db, res, req) => {
  const { sale } = request.body;

  db.query('INSERT INTO sale (notes, registry_date, fk_brick, fk_doctor, fk_pharmacy) VALUES ($1, $2, $3, $4, $5)', [sale.notes, sale.registry_date, sale.fk_brick, sale.fk_doctor, sale.fk_pharmacy], (err,results) => {
    if (err) {
      throw res.status(501).json({error: err, msg: "Could not add new Sale"});
    }
    res.status(201).json({msg: "Sale successfully added with ID: ${results.insertId}"})
  })
}

// Obtain list of delegates 
// TODO  - NOT TESTED 
module.exports.getDelegates = (db, res, req) => {
  db.query('SELECT * FROM delegate ORDER BY name ASC', (err,results) => {
    if (err) {
      throw res.status(502).json({error: err, msg: "Could not obtain list of Delegates"});
    }
    res.status(200).json(results.rows)
  })
}

// Add delegate
// TODO - NOT TESTED 
// TODO - adicionar contacto
module.exports.createDelegate= (db, res, req) => {
  const { del } = request.body;
  db.query('INSERT INTO delegate (name, registry_date, state, fk_id_contact) VALUES ($1, $2, $3, $4)', [del.name, del.registry_date, true, del.fk_id_contact], (err,results) => {
    if (err) {
      throw res.status(503).json({error: err, msg: "Could not add new Delegate"});
    }
    res.status(201).json({msg: "Delegate successfully added with ID: ${results.insertId}"})
  })
}


// Obtain delegate by id 
// TODO - NOT TESTED 
module.exports.getDelegateById = (db, delegate_id, res, req) => {
  db.query('SELECT * FROM delegate WHERE id = $1', [delegate_id], (err,results) => {
    if (err) {
      throw res.status(504).json({error: err, msg: "Could not obtain Delegate with ID: ${delegate_id}"});
    }
    res.status(200).json(results.rows)
  })
}

// Update delegate by id
// TODO - NOT TESTED 
module.exports.updateDelegate= (db, delegate_id, res, req) => {
  const { del } = request.body;
  db.query('UPDATE delegate SET name = $1, state = $2, fk_id_contact = $3 WHERE id = ${delegate_id}', [del.name, del.state, del.fk_id_contact], (err,results) => {
    if (err) {
      throw res.status(505).json({error: err, msg: "Could not update Delegate with ID: ${results.insertId}"});
    }
    res.status(200).json({msg: "Successfully updated Delegate with ID: ${results.insertId}"})
  })
}








// Obtain list of visits 
// TODO
module.exports.getVisits = (db, res, req) => {
  db.query('SELECT * FROM visit ORDER BY id ASC', (err,results) => {
    if (err) {
      throw res.status(520).json({error: err, msg: "Could not obtain list of Visits"});
    }
    res.status(200).json(results.rows)
  })
}

// Add visit
// TODO - NOT TESTED
module.exports.createVisit = (db, res, req) => {
  const { visit } = request.body;

  db.query('INSERT INTO visit (date, visit_state, fk_Brick, fk_doctor, fk_pharmacy) VALUES ($1, $2, $3, $4, $5)', [visit.date, visit.visit_state, visit.fk_Brick, visit.fk_doctor, visit.fk_pharmacy], (err,results) => {
    if (err) {
      throw res.status(521).json({error: err, msg: "Could not add new Visit"});
    }
    res.status(201).json({msg: "Visit successfully added with ID: ${results.insertId}"})
  })
}





// QUERY TEST
// IGNORE
module.exports.getTowns = (db, res, req) => {
  db.query('SELECT * FROM town ORDER BY id_town ASC', (err,results) => {
    if (err) {
      throw res.status(500).json({error: err, msg: "ARDEU AMIGO"});
    }
    res.status(200).json(results.rows)
  })
}
