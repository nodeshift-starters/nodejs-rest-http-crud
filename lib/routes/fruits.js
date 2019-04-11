'use strict';

const express = require('express');
/* eslint new-cap: "warn" */
const router = express.Router();

const validations = require('../validations');
const fruits = require('../api/fruits');

/**
   * @swagger
   * /api/fruits/{id}:
   *   get:
   *     summary: Get a fruit by id
   *     parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: integer
   *        required: true
   *        description: Numeric id of the fruit to get
   *     tags:
   *      - Fruits
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: fruit
   */
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

/**
   * @swagger
   * /api/fruits/:
   *   get:
   *     summary: Get all fruits
   *     tags:
   *      - Fruits
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: array of fruits
   */
router.get('/fruits', (request, response) => {
  fruits.findAll().then(results => {
    response.send(results.rows);
  }).catch(() => {
    response.sendStatus(400);
  });
});

/** 
* @swagger
*  /api/fruits:
*    post:
*      summary: Add a new fruit
*      tags:
*       - Fruits
*      consumes:
*        - application/json
*      parameters:
*        - in: body
*          name: fruit
*          description: The fruit to add
*          required: true
*          schema:
*            type: object
*            properties:
*              name:         
*                type: string
*              stock:   
*                type: integer
*      responses:
*        '201':
*          description: Created
*/
router.post('/fruits', validations.validateCreateUpdateRequest, (request, response) => {
  const {name, stock} = request.body;
  return fruits.create(name, stock).then(result => {
    response.status(201);
    return response.send(result.rows[0]);
  }).catch(error => {
    response.status(400);
    response.send(error);
  });
});

/** 
* @swagger
*  /api/fruits/{id}:
*    put:
*      summary: Update a fruit
*      tags:
*       - Fruits
*      consumes:
*        - application/json
*      parameters:
*        - in: path
*          name: id
*          schema:
*           type: integer
*          required: true
*          description: Numeric id of the fruit to update
*        - in: body
*          name: fruit
*          description: The fruit to update
*          required: true
*          schema:
*            type: object
*            properties:
*              name:         
*                type: string
*              stock:   
*                type: integer
*      responses:
*        '204':
*          description: Updated
*/
router.put('/fruits/:id', validations.validateCreateUpdateRequest, (request, response) => {
  const {name, stock} = request.body;
  const {id} = request.params;
  fruits.update({name, stock, id}).then(result => {
    if (result.rowCount === 0) {
      response.status(404);
      return response.send(`Unknown item ${id}`);
    }

    return response.sendStatus(204);
  }).catch(error => {
    response.status(400);
    response.send(error);
  });
});

/**
   * @swagger
   * /api/fruits/{id}:
   *   delete:
   *     summary: Delete a fruit by id
   *     parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: integer
   *        required: true
   *        description: Numeric id of the fruit to delete
   *     tags:
   *      - Fruits
   *     produces:
   *      - application/json
   *     responses:
   *       204:
   *         description: Deleted
   */
router.delete('/fruits/:id', (request, response) => {
  const {id} = request.params;
  fruits.remove(id).then(result => {
    if (result.rowCount === 0) {
      response.status(404);
      return response.send(`Unknown item ${id}`);
    }

    return response.sendStatus(204);
  }).catch(error => {
    response.status(400);
    response.send(error);
  });
});

module.exports = router;
