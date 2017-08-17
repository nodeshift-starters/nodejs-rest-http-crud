
node("launchpad-nodejs") {
  checkout scm
   stage("Deploy database") {
    sh "if ! oc get service my-database | grep my-database; then oc new-app -e POSTGRESQL_USER=luke -ePOSTGRESQL_PASSWORD=secret -ePOSTGRESQL_DATABASE=my_data openshift/postgresql-92-centos7 --name=my-database; fi"
  }
  stage("Build") {
    sh "npm install"
  }
  stage("Deploy") {
    sh "npm run openshift"
  }
}
