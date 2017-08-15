'use strict';

const db = require('../db');

function find (request, response) {
  db.query('SELECT * FROM products WHERE id = $1', [request.params.id]).then((result) => {
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
  db.query('INSERT INTO products (name, stock) VALUES ($1, $2)', [request.body.name, request.body.stock]).then((result) => {
    return response.sendStatus(201);
  }).catch((err) => {
    response.status(400);
    response.send(err);
  });
}

function update (request, response) {
  db.query('UPDATE products SET name = $1, stock = $2 WHERE id = $3', [request.body.name, request.body.stock, request.params.id]).then((result) => {
    return response.sendStatus(204);
  }).catch((err) => {
    response.status(400);
    response.send(err);
  });
}

function remove (request, response) {
  db.query('DELETE FROM products WHERE id = $1', [request.params.id]).then((result) => {
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
