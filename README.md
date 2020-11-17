[![Build Status](https://travis-ci.org/nodeshift-starters/nodejs-rest-http-crud.svg?branch=master)](https://travis-ci.org/nodeshift-starters/nodejs-rest-http-crud) [![Coverage Status](https://coveralls.io/repos/github/nodeshift-starters/nodejs-rest-http-crud/badge.svg?branch=master)](https://coveralls.io/github/nodeshift-starters/nodejs-rest-http-crud?branch=master) [![Greenkeeper badge](https://badges.greenkeeper.io/nodeshift-starters/nodejs-rest-http-crud.svg)](https://greenkeeper.io/)

Example CRUD Application

### Getting Started

#### Running Locally

First, install the dependencies

`npm install`

A Postgres DB is needed, so if you are using Docker, then you can start a postgres db easily.

`docker run --name os-postgres-db -e POSTGRESQL_USER=luke -e POSTGRESQL_PASSWORD=secret -e POSTGRESQL_DATABASE=my_data -d -p 5432:5432 centos/postgresql-10-centos7`

In this example, the db user is `luke`, the password is `secret` and the database is `my_data`

You can then start the application like this:

`DB_USERNAME=luke DB_PASSWORD=secret ./bin/www`


Then go to http://localhost:3000


#### Running on Openshift

First, make sure you have an instance of Openshift setup and are logged in using `oc login`.

Then create a new project using the `oc` commands

`oc new-project fun-node-fun`

For this example, you will also need a postgres db running on your Openshift cluster.

`oc new-app -e POSTGRESQL_USER=luke -ePOSTGRESQL_PASSWORD=secret -ePOSTGRESQL_DATABASE=my_data centos/postgresql-10-centos7 --name=my-database`

Then run `npm run openshift` to deploy your app

Then you can navigate to the newly exposed route, something similar to "http://nodejs-rest-http-crud-boosters.192.168.99.100.nip.io/",  this will probably be different based on your Openshift IP address

#### Install with Helm

```sh 
helm install os-postgres-db --set postgresqlPassword=secret,postgresqlDatabase=my_data,postgresqlUsername=Luke bitnami/postgresql
```


To deploy the app via Helm you will need docker installed and a kubernetes cluster.

 First build the docker image


 ```sh
 docker build -t nodejs-rest-http-crud:1.0.0 .
 ```

 Once the image is built, you can deploy it to you kube cluster using helm. From within the top directory run:

 ```sh
 helm install test-app ./nodejs-rest-http-crud-helm
 ```

 This deploys the app to your kube cluster and displayed some commands which you need to run inorder to be able to reach the application. Just copy paste and run them.


 ```sh
 ```

 To undeploy the app simply run:

 ```sh
 helm uninstall test-app
 helm uninstall os-postgres-db
 ```

 Make sure you delete the postgres PVC if you want a fresh instance otherwise it will reuse the data/config from the prior instance

 ```sh
 kubectl get pvc
 kubectl delete pvc data-os-postgres-db-postgresql-0
 ```
