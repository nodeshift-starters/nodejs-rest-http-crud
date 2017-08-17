'use strict';

function validateCreate (request, response, next) {
  // No need to check for no body, express will make body an empty object
  const {name, stock, id} = request.body;

  if (!name) {
    response.status(400);
    return response.send('The name must not be null');
  }

  if (!stock) {
    response.status(400);
    return response.send('The stock must not be greater or equal to 0');
  }

  if (id) {
    response.status(400);
    return response.send('The created item already contains an id');
  }

  next();
}

function validateUpdate (request, response, next) {
  // No need to check for no body, express will make body an empty object
  const {name, stock, id} = request.body;

  if (!name) {
    response.status(400);
    return response.send('The name must not be null');
  }

  if (!stock) {
    response.status(400);
    return response.send('The stock must not be greater or equal to 0');
  }

  if (id && id !== request.params.id) {
    response.status(400);
    return response.send('The id cannot be changed');
  }

  next();
}

module.exports = {
  validateCreate,
  validateUpdate
};
