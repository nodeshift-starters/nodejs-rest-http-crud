const nodeshift = require('nodeshift');

const options = {
  osc: {
    strictSSL: false
  }
};

nodeshift.deployApplication(options).then((message) => {
  console.log('Application Depoyed');
}).catch((err) => {
  console.error('Error', err);
})
