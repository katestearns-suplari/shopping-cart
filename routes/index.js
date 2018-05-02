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
    const data = {quantity: req.body.quantity, item: req.body.item};

    pg.connect(connectionString, (err, client, done) => {
      if (err) {
          done();
          console.log(err);
          return res.status(500).json({success: false, data: err});
      }

      client.query('INSERT INTO cart(quantity, item) values($1, $2)', [data.quantity, data.item]);

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

// TODO: put, delete


 // Product routes

// TODO: 

router.put('/api/v1/products/:id', (req, res, next) => {
     const results = [];
     const data = {name: req.body.name, description: req.body.description, price: req.body.price, imageurl: req.body.imageurl};

     pg.connect(connectionString, (err, client, done) => {
         if (err) {
             done();
             console.log(err);
             return res.status(500).json({success: false, data: err});
         }

         const id = req.params.id
         client.query('UPDATE products SET name=($1), description=($2), price=($3), imageurl=($4) WHERE id=($5)', [data.name, data.description, data.price, data.imageurl, id])

         const query = client.query('SELECT * FROM products ORDER BY price DESC');
         query.on('row', (row) => {
             results.push(row);
         });

         query.on('end', () => {
             done();
             return res.json(results);
         });

     })
 })

router.delete('/api/v1/products/:id', (req, res, next) => {
    const results = [];
    const id = req.params.id;

    pg.connect(connectionString, (err, client, done) => {
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        client.query('UPDATE products SET name=($1), description=($2), price=($3), imageurl=($4) WHERE id=($5)', [data.name, data.description, data.price, data.imageurl, id])

        const query = client.query('SELECT * FROM products ORDER BY price DESC');
        query.on('row', (row) => {
            results.push(row);
        });

        query.on('end', () => {
            done();
            return res.json(results);
        });
    });
})

module.exports = router;
