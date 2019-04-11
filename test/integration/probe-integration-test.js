'use strict';

const test = require('tape');
const supertest = require('supertest');
const rhoaster = require('rhoaster');

const testEnvironment = rhoaster({
  deploymentName: 'nodejs-rest-http-crud',
  nodeVersion: '10.x'
});

testEnvironment.deploy()
  .then(runTests)
  .then(_ => test.onFinish(testEnvironment.undeploy))
  .catch(console.error);

function runTests (route) {
  // GET fruits
  test('/api/health/liveness', t => {
    t.plan(2);
    supertest(route)
      .get('/api/health/liveness')
      .expect(200)
      .then(response => {
        t.equal(response.body,'OK', 'response.body is OK');
        t.end();
      });
  });
}