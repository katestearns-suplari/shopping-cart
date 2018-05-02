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

router.get('/api/v1/products', (req, res, next)=> {
     const results = [];

     pg.connect(connectionString, (err, client, done) => {
         if (err) {
             done();
             console.log(err);
             return res.status(500).json({success: false, data: err});
         }

         const query = client.query('SELECT * FROM products ORDER BY price DESC;');
         query.on('row', (row)=> {
             results.push(row);
         })

         query.on('end', () => {
             done();
             return res.json(results);
         });
     });
 })

router.post('/api/v1/products', (req, res, next) => {
     const results = [];
     const data = {name: req.body.name, description: req.body.description, price: req.body.price, imageurl: req.body.imageurl};

     pg.connect(connectionString, (err, client, done) => {
         if (err) {
             done();
             console.log(err);
             return res.status(500).json({success: false, data: err});
         }

         client.query('INSERT INTO products(name, description, price, imageurl) values($1, $2, $3, $4)', [data.name, data.description, data.price, data.imageurl]);

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

router.get('/api/v1/carts/total', (req, res, next) => {
    const cart = {};
    pg.connect(connectionString, (err, client, done) => {
        if (err) {
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        client.query('SELECT quantity, itemid FROM cart;')
        .then(({rows}) => {
            for (let row of rows) {
                cart[row.itemid] = {quantity: row.quantity}
            }
        })
        .catch(err => console.log(err))

        client.query('SELECT id, price FROM products;')
        .catch(err => console.log(err))
        .then(({rows}) => {
            for (let row of rows) {
                cart[row.id] = Object.assign({}, cart[row.id], row)
            }
            const cartTotal = calculateCart(cart);
            client.end((err) => {
                if (err) return res.json(err);
                return res.json(cartTotal);
            })
        })
    })
})


function calculateCart(cart) {
    let total = 0;
    let ids = Object.keys(cart);
    for (let i=0; i<ids.length; i++) {
        let id = ids[i];
        quantity = cart[id].quantity || 0;
        price = cart[id].price || 0;
        total += Number(quantity * price);
    }
    return total;
}

module.exports = router;
