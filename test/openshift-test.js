const test = require('tape');
const OpenshiftTestAssistant = require('openshift-test-assistant');
const openshiftAssistant = new OpenshiftTestAssistant();
const path = require('path');
const request = require('supertest');

test('setup', (t) => {
  openshiftAssistant.deploy({
    'projectLocation': path.join(__dirname, '/..'),
    'strictSSL': false
  }).then(() => {
    t.ok(true); // indicate success
    t.end();
  }).catch(reason => {
    t.fail(reason);
    t.end();
  });
});

test('test POST fruit', (t) => {
  if (!openshiftAssistant.isReady()) {
    t.skip();
    t.end();
  } else {
    const fruitData = {
      name: 'Banana',
      stock: 10
    };

    // Insert fruit
    request(openshiftAssistant.getRoute())
      .post('/api/fruits')
      .send(fruitData)
      .expect(201)
      .then(() => {
        // Verify that fruit is inserted
        request(openshiftAssistant.getRoute())
          .get('/api/fruits')
          .expect('Content-Type', /json/)
          .expect(200)
          .then(response => {
            t.notEqual(response.body.find(val => val.name === fruitData.name), undefined, 'Inserted fruit should be found');
            t.end();
          })
          .catch(reason => {
            t.fail(reason);
            t.end();
          });
      })
      .catch(reason => {
        t.fail(reason);
        t.end();
      });
  }
});

test('Get all fruit, get single fruit', (t) => {
  if (!openshiftAssistant.isReady()) {
    t.skip();
    t.end();
  } else {
    // List all fruit
    request(openshiftAssistant.getRoute())
      .get('/api/fruits')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        // take single fruit
        t.equal(Array.isArray(response.body), true, 'should return an array');
        t.equal(response.body[0].hasOwnProperty('id'), true, 'should have an id');
        t.equal(response.body[0].hasOwnProperty('name'), true, 'should have an name');
        t.equal(response.body[0].hasOwnProperty('stock'), true, 'should have an stock');
        const id = response.body[0].id;
        const name = response.body[0].name;
        const stock = response.body[0].stock;
        // Get this single fruit and verify it's attributes
        request(openshiftAssistant.getRoute())
          .get('/api/fruits/' + id)
          .expect('Content-Type', /json/)
          .expect(200)
          .then(response => {
            t.equal(response.body.id, id, 'Id should be equal to requested one');
            t.equal(response.body.name, name, 'Name should be equal to requested one');
            t.equal(response.body.stock, stock, 'Stock should be equal to requested one');
            t.end();
          }).catch(reason => {
            t.fail(reason);
            t.end();
          });
      })
      .catch(reason => {
        t.fail(reason);
        t.end();
      });
  }
});

test('teardown', (t) => {
  openshiftAssistant.undeploy()
    .then(() => {
      t.end();
    }).catch(reason => {
      t.fail(reason);
      t.end();
    });
});
