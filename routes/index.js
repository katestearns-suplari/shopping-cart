const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/shopping-cart';

// Cart Routes
// quantity | item
// ---------+-------
//  numeric | JSON

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

router.put('/api/v1/carts/:id', (req, res, next) => {
    const results = [];
    const id = req.params.id;
    const data = {quantity: req.body.quantity, item: req.body.item};

    pg.connect(connectionString, (err, client, done) => {
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        client.query('UPDATE cart SET quantity=($1), item=($2) WHERE id=($3)', [data.quantity, data.item, id]);
        const query = client.query('SELECT * FROM cart ORDER BY quantity DESC');
        // Stream results back one row at a time
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
    const id = req.params.id;

    pg.connect(connectionString, (err, client, done) => {
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        client.query('DELETE from cart WHERE id=($1)', [id]);

        const query = client.query('SELECT * from cart ORDER BY quantity DESC');

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
