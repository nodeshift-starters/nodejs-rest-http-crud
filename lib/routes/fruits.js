'use strict';

const express = require('express');
/* eslint new-cap: "warn" */
const router = express.Router();

const validations = require('../validations');
const fruits = require('../api/fruits');

router.get('/fruits/:id', async (request, response) => {
  const { id } = request.params;
  try {
    const result = await fruits.find(id);
    if (result.rowCount === 0) {
      response.status(404);
      return response.send(`Item ${id} not found`);
    }
    return response.send(result.rows[0]);
  } catch (error) {
    response.sendStatus(400);
  }
});

router.get('/fruits', async (_, response) => {
  try {
    const results = await fruits.findAll();
    response.send(results.rows);
  } catch (error) {
    console.log(error);
    response.sendStatus(400);
  }
});

router.post('/fruits', validations.validateCreateUpdateRequest, async (request, response) => {
  const { name, stock } = request.body;
  try {
    const result = await fruits.create(name, stock);
    response.status(201);
    return response.send(result.rows[0]);
  } catch (error) {
    response.status(400);
    response.send(error);
  }
});

router.put('/fruits/:id', validations.validateCreateUpdateRequest, async (request, response) => {
  const { name, stock, id } = request.body;
  try {
    const result = await fruits.update({ name, stock, id });
    if (result.rowCount === 0) {
      response.status(404);
      return response.send(`Unknown item ${id}`);
    }
    return response.sendStatus(204);
  } catch (error) {
    response.status(400);
    response.send(error);
  }
});

router.delete('/fruits/:id', async (request, response) => {
  const { id } = request.params;
  try {
    const result = await fruits.remove(id);
    if (result.rowCount === 0) {
      response.status(404);
      return response.send(`Unknown item ${id}`);
    }
    return response.sendStatus(204);
  } catch (error) {
    response.status(400);
    response.send(error);
  }
});

module.exports = router;
