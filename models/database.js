const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/shopping-cart';

const client = new pg.Client(connectionString);
client.connect();

client.query(
    'CREATE TABLE products(id SERIAL PRIMARY KEY, name varchar(50), description varchar(100), price decimal, imageurl varchar(150));'
)

client.query('INSERT into products(name, description, price, imageurl) values($1, $2, $3, $4)',
            ['Thingamabob', 'Lorem ipsum dolor sit amet', 14.99, 'https://wallpapersite.com/images/pages/pic_h/4644.jpg'])
client.query('INSERT into products(name, description, price, imageurl) values($1, $2, $3, $4)',
            ['Gizmo', 'Lorem ipsum dolor sit amet', 34.99, 'https://www.theversatilegent.com/wp-content/uploads/2012/06/3930467043_b61b781575.jpg'])
client.query('CREATE TABLE cart(id SERIAL PRIMARY KEY, quantity NUMERIC, itemid NUMERIC)')

const query = client.query(
    'INSERT into cart(quantity, itemid) values($1, $2)',
    [2, 1]
);

query.on('end', () => { client.end(); })
