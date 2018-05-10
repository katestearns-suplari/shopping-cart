const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/shopping-cart';

// Cart Routes
// quantity | itemid
// ---------+-------
//  numeric | numeric

router.post('/api/v1/carts', (req, res, next) => {
    const results = [];
    const data = {quantity: req.body.quantity, itemid: req.body.itemid};

    pg.connect(connectionString, (err, client, done) => {
      if (err) {
          done();
          console.log(err);
          return res.status(500).json({success: false, data: err});
      }

      client.query('INSERT INTO cart(quantity, itemid) values($1, $2)', [data.quantity, data.itemid]);

      const query = client.query('SELECT * FROM cart ORDER BY quantity DESC');

      query.on('row', (row) => {
        results.push(row);
       });

      query.on('end', () => {
        done();
        return res.json(results);
       });
     });
})

router.get('/api/v1/carts', (req, res, next) => {
  const results = [];
  pg.connect(connectionString, (err, client, done) => {
    if (err) {
        done();
        console.log(err);
        return res.status(500).json({success: false, data: err});
    }

    const query = client.query('SELECT * FROM cart ORDER BY quantity DESC;');
    query.on('row', (row) => {
      results.push(row);
     });

    query.on('end', () => {
      done();
      return res.json(results);
     });
   });
 })

router.put('/api/v1/carts/:id', (req, res, next) => {
    const results = [];
    const data = {quantity: req.body.quantity, item: req.body.item};

    pg.connect(connectionString, (err, client, done) => {
        if(err) {
            done();
            console.log(err);
            return res.status(500).json({success : false, data: err});
        }

        const id = req.params.id;
        const query = client.query('UPDATE cart SET quantity=($1), item=($2) WHERE id=($3)', [data.quantity, data.item, id]);
        query.on('row', (row) => {
            results.push(row);
        });

        query.on('end', () => {
            done();
            return res.json(results);
        });
    });
 })

router.delete('/api/v1/carts/:id', (req, res, next) => {
     const results = [];

     pg.connect(connectionString, (err, client, done) => {
         if (err) {
             done();
             console.log(err);
             return res.status(500).json({success: false, data: err});
         }

         const id = req.params.id;
         const query = client.query('DELETE FROM cart WHERE id=($1)', [id]);
         query.on('row', (row) => {
             results.push(row);
         });

         query.on('end', ()=> {
             done();
             return res.json(results);
         })
     })
 })


 // Product routes


module.exports = router;
