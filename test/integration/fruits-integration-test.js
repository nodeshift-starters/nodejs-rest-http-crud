/* eslint-disable no-undef */
'use strict';

const assert = require('assert');
const supertest = require('supertest');
const rhoaster = require('rhoaster');

const testEnvironment = rhoaster({
  deploymentName: 'nodejs-rest-http-crud',
  dockerImage: 'registry.access.redhat.com/ubi8/nodejs-12'
});

describe('Fruits', () => {
  let route;
  before(async function () {
    this.timeout(0);
    route = await testEnvironment.deploy();
  });

  it('/api/fruits', async () => {
    const { body } = await supertest(route)
      .get('/api/fruits')
      .expect(200)
      .expect('Content-Type', /json/);

    assert.strictEqual(Array.isArray(body), true);
    assert.strictEqual(body.length, 3);
  });

  it('/api/fruit/:id', async () => {
    const { body } = await supertest(route)
      .get('/api/fruits/1')
      .expect(200)
      .expect('Content-Type', /json/);

    assert.strictEqual(Array.isArray(body), false);
    assert.strictEqual(body.id, 1);
    assert.strictEqual(body.name, 'Apple');
    assert.strictEqual(body.stock, '10');
  });

  it('/api/fruit/:id - does not exist', async () => {
    const response = await supertest(route)
      .get('/api/fruits/10')
      .expect(404)
      .expect('Content-Type', /text/);

    assert.strictEqual(response.text, 'Item 10 not found');
  });

  it('POST /api/fruit/', async () => {
    const fruitData = {
      name: 'Banana',
      stock: '10'
    };

    const { body } = await supertest(route)
      .post('/api/fruits')
      .send(fruitData)
      .expect(201)
      .expect('Content-Type', /json/);

    assert.strictEqual(Array.isArray(body), false);
    assert.ok(body.id);
    assert.strictEqual(body.name, fruitData.name);
    assert.strictEqual(body.stock, fruitData.stock);
    // Clean up
    await supertest(route).delete(`/api/fruits/${body.id}`);
  });

  it('POST /api/fruit/ - send non json', async () => {
    const fruitData = '{name: \'Banana\', stock: \'10\'}';

    const response = await supertest(route)
      .post('/api/fruits')
      .send(fruitData)
      .expect(422);

    assert.strictEqual(response.statusCode, 422);
  });

  it('PUT /api/fruit/:id', async () => {
    const fruitData = {
      name: 'put fruit',
      stock: '10'
    };

    let response = await supertest(route)
      .post('/api/fruits')
      .send(fruitData)
      .expect(201);
    assert.strictEqual(response.statusCode, 201);

    const { id } = response.body;

    const updatedFruit = {
      name: response.body.name,
      stock: '20'
    };

    response = await supertest(route)
      .put(`/api/fruits/${id}`)
      .send(updatedFruit)
      .expect(204);
    assert.strictEqual(response.statusCode, 204);
    // Clean up
    await supertest(route).delete(`/api/fruits/${response.body.id}`);
  });

  after(async function () {
    this.timeout(0);
    await testEnvironment.undeploy();
  });
});
