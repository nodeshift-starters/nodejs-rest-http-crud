'use strict';

const test = require('tape');
const supertest = require('supertest');
const proxyquire = require('proxyquire');

test('test liveness ok', t => {
  const mockDb = {
    init: () => {
      return Promise.resolve();
    },
    query: (query, cb) => {
      cb(null, true);
    }
  };

  const app = proxyquire('../app', {
    './lib/db': mockDb
  });

  supertest(app)
    .get('/api/health/liveness')
    .expect(200)
    .then(response => {
      t.equal(response.text, 'OK', 'should return OK');
      t.end();
    });
});

test('test liveness not ok', t => {
  const mockDb = {
    init: () => {
      return Promise.resolve();
    },
    query: (query, cb) => {
      cb('error');
    }
  };

  const app = proxyquire('../app', {
    './lib/db': mockDb
  });

  supertest(app)
    .get('/api/health/liveness')
    .expect(500)
    .then(response => {
      t.equal(response.text, 'not ok', 'should return not ok');
      t.end();
    });
});

test('SIGTERM', t => {
  const mockDb = {
    init: () => {
      return Promise.resolve();
    },
    end: () => {
      t.end();
    }
  };

  process.on = (signal, cb) => {
    if (signal === 'SIGTERM') {
      cb();
    }
  };

  proxyquire('../app', {
    './lib/db': mockDb
  });
});
