const nodeshift = require('nodeshift');

const options = {
  strictSSL: false
};

nodeshift.deploy(options).then(() => {
  console.log('Application deployed.');
}).catch(error => {
  console.error('Error', error);
});
