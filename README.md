[![Build Status](https://travis-ci.org/bucharest-gold/nodejs-rest-http-crud.svg?branch=master)](https://travis-ci.org/bucharest-gold/nodejs-rest-http-crud) [![Coverage Status](https://coveralls.io/repos/github/bucharest-gold/nodejs-rest-http-crud/badge.svg?branch=master)](https://coveralls.io/github/bucharest-gold/nodejs-rest-http-crud?branch=master) [![Greenkeeper badge](https://badges.greenkeeper.io/bucharest-gold/nodejs-rest-http-crud.svg)](https://greenkeeper.io/)

Example CRUD Application

### Getting Started

#### Running Locally

First, install the dependencies

`npm install`

A Postgres DB is needed, so if you are using Docker, then you can start a postgres db easily.

`docker run --name os-postgres-db -e POSTGRESQL_USER=luke -e POSTGRESQL_PASSWORD=secret -e POSTGRESQL_DATABASE=my_data -d -p 5432:5432  openshift/postgresql-92-centos7`

In this example, the db user is `luke`, the password is `secret` and the database is `my_data`

You can then start the application like this:

`DB_USERNAME=luke DB_PASSWORD=secret ./bin/www`


Then go to http://localhost:3000
