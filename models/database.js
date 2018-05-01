const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/shopping-cart';

const client = new pg.Client(connectionString);
client.connect();

const query = client.query(
    'CREATE TABLE items(id SERIAL PRIMARY KEY, name VARCHAR(40) not null, price NUMERIC, url VARCHAR(40))'
);

query.on('end', () => { client.end(); })

