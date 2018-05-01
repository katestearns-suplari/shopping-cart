const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/shopping-cart';

const client = new pg.Client(connectionString);
client.connect();

const query = client.query(
    'CREATE TABLE cart(id SERIAL PRIMARY KEY, quantity NUMERIC, item JSON)'
);

query.on('end', () => { client.end(); })
