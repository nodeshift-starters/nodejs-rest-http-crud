const nodeshift = require('nodeshift');

const options = {
  strictSSL: false
};

nodeshift.deploy(options).then((message) => {
  console.log('Application Depoyed');
}).catch((err) => {
  console.error('Error', err);
});
