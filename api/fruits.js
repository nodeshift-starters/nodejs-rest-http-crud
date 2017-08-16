'use strict';

const db = require('../db');

function find (request, response) {
  const {id} = request.params;
  db.query('SELECT * FROM products WHERE id = $1', [id]).then((result) => {
    if (result.rowCount === 0) {
      response.status = 404;
      return response.send(`Item ${id} not found`);
    }
    return response.send(result.rows[0]);
  }).catch((err) => {
    response.status(400);
    response.send(err);
  });
}

function findAll (request, response) {
  db.query('SELECT * FROM products').then((result) => {
    return response.send(result.rows);
  }).catch((err) => {
    response.status(400);
    response.send(err);
  });
}

function create (request, response) {
  const {name, stock} = request.body;
  db.query('INSERT INTO products (name, stock) VALUES ($1, $2)', [name, stock]).then((result) => {
    return response.sendStatus(201);
  }).catch((err) => {
    response.status(400);
    response.send(err);
  });
}

function update (request, response) {
  const {name, stock} = request.body;
  const {id} = request.params;
  db.query('UPDATE products SET name = $1, stock = $2 WHERE id = $3', [name, stock, id]).then((result) => {
    if (result.rowCount === 0) {
      response.status = 404;
      return response.send(`Unknown item ${id}`);
    }
    return response.sendStatus(204);
  }).catch((err) => {
    response.status(400);
    response.send(err);
  });
}

function remove (request, response) {
  const {id} = request.params;
  db.query('DELETE FROM products WHERE id = $1', [id]).then((result) => {
    if (result.rowCount === 0) {
      response.status = 404;
      return response.send(`Unknown item ${id}`);
    }
    return response.sendStatus(204);
  }).catch((err) => {
    response.status(400);
    response.send(err);
  });
}

module.exports = {
  find,
  findAll,
  create,
  update,
  remove
};
