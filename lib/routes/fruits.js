'use strict';

const express = require('express');
const router = express.Router();

const validations = require('../validations');
const fruits = require('../api/fruits');

router.get('/fruits/:id', (request, response) => {
  const {id} = request.params;
  fruits.find(id).then(result => {
    if (result.rowCount === 0) {
      response.status(404);
      return response.send(`Item ${id} not found`);
    }
    return response.send(result.rows[0]);
  }).catch(() => {
    response.sendStatus(400);
  });
});

router.get('/fruits', (request, response) => {
  fruits.findAll().then(results => {
    response.send(results.rows);
  }).catch(() => {
    response.sendStatus(400);
  });
});

router.post('/fruits', validations.validateCreate, (request, response) => {
  const {name, stock} = request.body;
  return fruits.create(name, stock).then(() => {
    response.sendStatus(201);
  }).catch((err) => {
    response.status(400);
    response.send(err);
  });
});

router.put('/fruits/:id', validations.validateUpdate, (request, response) => {
  const {name, stock} = request.body;
  const {id} = request.params;
  fruits.update({name, stock, id}).then((result) => {
    if (result.rowCount === 0) {
      response.status(404);
      return response.send(`Unknown item ${id}`);
    }
    return response.sendStatus(204);
  }).catch((err) => {
    response.status(400);
    response.send(err);
  });
});

router.delete('/fruits/:id', (request, response) => {
  const {id} = request.params;
  fruits.remove(id).then((result) => {
    if (result.rowCount === 0) {
      response.status(404);
      return response.send(`Unknown item ${id}`);
    }
    return response.sendStatus(204);
  }).catch((err) => {
    response.status(400);
    response.send(err);
  });
});

module.exports = router;
