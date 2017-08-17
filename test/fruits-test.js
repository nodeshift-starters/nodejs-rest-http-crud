'use strict';

const test = require('tape');
const supertest = require('supertest');
const proxyquire = require('proxyquire');

const mockDb = {
  init: () => {
    return Promise.resolve();
  }
};

test('test GET all fruits', (t) => {
  const mockApi = {
    findAll: () => Promise.resolve({rows: [{id: 1}]})
  };

  // Mock the nested require
  const routesStub = proxyquire('../lib/routes/fruits', {
    '../api/fruits': mockApi
  });

  const app = proxyquire('../app', {
    './lib/db': mockDb,
    './lib/routes/fruits': routesStub
  });

  supertest(app)
    .get('/api/fruits')
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => {
      t.equal(Array.isArray(response.body), true, 'should return an array');
      t.equal(response.body.length, 1, 'should have a body length of 1');
      t.end();
    });
});

test('test GET all fruits - error', (t) => {
  const mockApi = {
    findAll: () => Promise.reject(new Error('error'))
  };

  // Mock the nested require
  const routesStub = proxyquire('../lib/routes/fruits', {
    '../api/fruits': mockApi
  });

  const app = proxyquire('../app', {
    './lib/db': mockDb,
    './lib/routes/fruits': routesStub
  });

  supertest(app)
    .get('/api/fruits')
    .expect(400)
    .then(response => {
      t.end();
    });
});

test('test GET fruit', (t) => {
  const mockApi = {
    find: (id) => {
      t.equal(id, '1', 'id should be 1 from the request params');
      return Promise.resolve({rows: [{id: id}]});
    }
  };

  // Mock the nested require
  const routesStub = proxyquire('../lib/routes/fruits', {
    '../api/fruits': mockApi
  });

  const app = proxyquire('../app', {
    './lib/db': mockDb,
    './lib/routes/fruits': routesStub
  });

  supertest(app)
    .get('/api/fruits/1')
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => {
      t.equal(Array.isArray(response.body), false, 'should not return an array');
      t.equal(response.body.id, '1', 'should have an id of 1');
      t.end();
    });
});

test('test GET fruit - return 404', (t) => {
  const mockApi = {
    find: () => Promise.resolve({rowCount: 0})
  };

  // Mock the nested require
  const routesStub = proxyquire('../lib/routes/fruits', {
    '../api/fruits': mockApi
  });

  const app = proxyquire('../app', {
    './lib/db': mockDb,
    './lib/routes/fruits': routesStub
  });

  supertest(app)
    .get('/api/fruits/1')
    .expect(404)
    .then(response => {
      t.equal(response.text, 'Item 1 not found', 'shhould have a message about not found id');
      t.end();
    });
});

test('test GET fruit - error', (t) => {
  const mockApi = {
    find: () => Promise.reject(new Error('error'))
  };

  // Mock the nested require
  const routesStub = proxyquire('../lib/routes/fruits', {
    '../api/fruits': mockApi
  });

  const app = proxyquire('../app', {
    './lib/db': mockDb,
    './lib/routes/fruits': routesStub
  });

  supertest(app)
    .get('/api/fruits/1')
    .expect(400)
    .then(response => {
      t.end();
    });
});

test('test POST fruit', (t) => {
  const fruitData = {
    name: 'Banana',
    stock: 10
  };

  const mockApi = {
    create: (name, stock) => {
      t.equal(name, fruitData.name, `respone.body.name should be ${fruitData.name}`);
      t.equal(stock, fruitData.stock, `respone.body.stock should be ${fruitData.stock}`);
      return Promise.resolve();
    }
  };

  // Mock the nested require
  const routesStub = proxyquire('../lib/routes/fruits', {
    '../api/fruits': mockApi
  });

  const app = proxyquire('../app', {
    './lib/db': mockDb,
    './lib/routes/fruits': routesStub
  });

  supertest(app)
    .post('/api/fruits')
    .send(fruitData)
    .expect(201)
    .then(response => {
      t.end();
    });
});

test('test POST fruit - error - no name', (t) => {
  const app = proxyquire('../app', {
    './lib/db': mockDb
  });

  supertest(app)
    .post('/api/fruits')
    .expect(400)
    .then(response => {
      t.equal(response.text, 'The name must not be null', 'has a need name message');
      t.end();
    });
});

test('test POST fruit - error - no stock', (t) => {
  const app = proxyquire('../app', {
    './lib/db': mockDb
  });

  supertest(app)
    .post('/api/fruits')
    .send({name: 'Banana'})
    .expect(400)
    .then(response => {
      t.equal(response.text, 'The stock must not be greater or equal to 0', 'has a need stock message');
      t.end();
    });
});

test('test POST fruit - error - id error', (t) => {
  const app = proxyquire('../app', {
    './lib/db': mockDb
  });

  supertest(app)
    .post('/api/fruits')
    .send({name: 'Banana', stock: 10, id: 22})
    .expect(400)
    .then(response => {
      t.equal(response.text, 'The created item already contains an id', 'has an id error message');
      t.end();
    });
});

test('test POST fruit - error', (t) => {
  const fruitData = {
    name: 'Banana',
    stock: 10
  };

  const mockApi = {
    create: (name, stock) => {
      return Promise.reject(new Error('error'));
    }
  };

  // Mock the nested require
  const routesStub = proxyquire('../lib/routes/fruits', {
    '../api/fruits': mockApi
  });

  const app = proxyquire('../app', {
    './lib/db': mockDb,
    './lib/routes/fruits': routesStub
  });

  supertest(app)
    .post('/api/fruits')
    .send(fruitData)
    .expect(400)
    .then(response => {
      t.end();
    });
});

test('test PUT fruit', (t) => {
  const fruitData = {
    name: 'Banana',
    stock: 10,
    id: '20'
  };

  const mockApi = {
    update: (options) => {
      t.equal(options.name, fruitData.name, `respone.body.name should be ${fruitData.name}`);
      t.equal(options.stock, fruitData.stock, `respone.body.stock should be ${fruitData.stock}`);
      t.equal(options.id, fruitData.id, `respone.body.stock should be ${fruitData.stock}`);
      return Promise.resolve({rowCount: 1});
    }
  };

  // Mock the nested require
  const routesStub = proxyquire('../lib/routes/fruits', {
    '../api/fruits': mockApi
  });

  const app = proxyquire('../app', {
    './lib/db': mockDb,
    './lib/routes/fruits': routesStub
  });

  supertest(app)
    .put('/api/fruits/20')
    .send(fruitData)
    .expect(204)
    .then(response => {
      t.end();
    });
});

test('test PUT fruit - error - no name', (t) => {
  const app = proxyquire('../app', {
    './lib/db': mockDb
  });

  supertest(app)
    .put('/api/fruits/20')
    .expect(400)
    .then(response => {
      t.equal(response.text, 'The name must not be null', 'has a need name message');
      t.end();
    });
});

test('test PUT fruit - error - no stock', (t) => {
  const app = proxyquire('../app', {
    './lib/db': mockDb
  });

  supertest(app)
    .put('/api/fruits/20')
    .send({name: 'name'})
    .expect(400)
    .then(response => {
      t.equal(response.text, 'The stock must not be greater or equal to 0', 'has a need stock message');
      t.end();
    });
});

test('test PUT fruit - error - id error', (t) => {
  const app = proxyquire('../app', {
    './lib/db': mockDb
  });

  supertest(app)
    .put('/api/fruits/20')
    .send({name: 'Banana', stock: 10, id: '22'})
    .expect(400)
    .then(response => {
      t.equal(response.text, 'The id cannot be changed', 'id error message');
      t.end();
    });
});

test('test PUT fruit - not found', (t) => {
  const fruitData = {
    name: 'Banana',
    stock: 10,
    id: '20'
  };

  const mockApi = {
    update: (options) => {
      return Promise.resolve({rowCount: 0});
    }
  };

  // Mock the nested require
  const routesStub = proxyquire('../lib/routes/fruits', {
    '../api/fruits': mockApi
  });

  const app = proxyquire('../app', {
    './lib/db': mockDb,
    './lib/routes/fruits': routesStub
  });

  supertest(app)
    .put('/api/fruits/20')
    .send(fruitData)
    .expect(404)
    .then(response => {
      t.equal(response.text, 'Unknown item 20', 'has unknown update error');
      t.end();
    });
});

test('test PUT fruit - error', (t) => {
  const fruitData = {
    name: 'Banana',
    stock: 10,
    id: '22'
  };

  const mockApi = {
    update: (name, stock) => {
      return Promise.reject(new Error('error'));
    }
  };

  // Mock the nested require
  const routesStub = proxyquire('../lib/routes/fruits', {
    '../api/fruits': mockApi
  });

  const app = proxyquire('../app', {
    './lib/db': mockDb,
    './lib/routes/fruits': routesStub
  });

  supertest(app)
    .put('/api/fruits/22')
    .send(fruitData)
    .expect(400)
    .then(response => {
      t.end();
    });
});

test('test DELETE fruit', (t) => {
  const mockApi = {
    remove: (id) => {
      t.equal(id, '1', 'id should be 1 from the request params');
      return Promise.resolve({rowCount: 1});
    }
  };

  // Mock the nested require
  const routesStub = proxyquire('../lib/routes/fruits', {
    '../api/fruits': mockApi
  });

  const app = proxyquire('../app', {
    './lib/db': mockDb,
    './lib/routes/fruits': routesStub
  });

  supertest(app)
    .delete('/api/fruits/1')
    .expect(204)
    .then(response => {
      t.end();
    });
});

test('test DELETE fruit - error - not found', (t) => {
  const mockApi = {
    remove: (id) => {
      return Promise.resolve({rowCount: 0});
    }
  };

  // Mock the nested require
  const routesStub = proxyquire('../lib/routes/fruits', {
    '../api/fruits': mockApi
  });

  const app = proxyquire('../app', {
    './lib/db': mockDb,
    './lib/routes/fruits': routesStub
  });

  supertest(app)
    .delete('/api/fruits/1')
    .expect(404)
    .then(response => {
      t.equal(response.text, 'Unknown item 1', 'has unkown error text');
      t.end();
    });
});

test('test DELETE fruit - error', (t) => {
  const mockApi = {
    remove: (id) => {
      return Promise.reject(new Error('error'));
    }
  };

  // Mock the nested require
  const routesStub = proxyquire('../lib/routes/fruits', {
    '../api/fruits': mockApi
  });

  const app = proxyquire('../app', {
    './lib/db': mockDb,
    './lib/routes/fruits': routesStub
  });

  supertest(app)
    .delete('/api/fruits/1')
    .expect(400)
    .then(response => {
      t.end();
    });
});
