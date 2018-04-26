const nodeshift = require('nodeshift');

const options = {
  strictSSL: false
};

nodeshift.deploy(options).then(() => {
  console.log('Application Depoyed');
}).catch(err => {
  console.error('Error', err);
});
