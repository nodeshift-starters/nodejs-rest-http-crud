'use strict';
const { Pool } = require('pg');

const serviceHost = process.env.MY_DATABASE_SERVICE_HOST || process.env.POSTGRESQL_SERVICE_HOST || 'localhost';
const user = process.env.DB_USERNAME || process.env.POSTGRESQL_USER || 'user';
const password = process.env.DB_PASSWORD || process.env.POSTGRESQL_PASSWORD || 'password';
const databaseName = process.env.POSTGRESQL_DATABASE || 'my_data';
const connectionString = `postgresql://${user}:${password}@${serviceHost}:5432/${databaseName}`;

const pool = new Pool({
  connectionString
});

let didInitHappen = false;

// -- Create the products table if not present
const initScript = `CREATE TABLE IF NOT EXISTS products (
  id        SERIAL PRIMARY KEY,
  name      VARCHAR(40) NOT NULL,
  stock     BIGINT
);

DELETE FROM products;

INSERT INTO products (name, stock) values ('Apple', 10);
INSERT INTO products (name, stock) values ('Orange', 10);
INSERT INTO products (name, stock) values ('Pear', 10);`;

async function query (text, parameters) {
  // Check that we have initialized the DB on each Query request
  if (!didInitHappen) {
    await init();
  }

  return pool.query(text, parameters);
}

function init () {
  return pool.query(initScript).then(() => {
    didInitHappen = true;
  });
}

module.exports = {
  query,
  init
};
