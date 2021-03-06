/* exported stderr */

const express = require('express');

const job = require(__dirname + '/alexaTask.js');
const lib = require(__dirname + '/../../../_lib/lib.js');

const app = express();

// download and load alexa data
job.initAlexa();

app.use(function (req, res, next) {
  let err = {error: ''};
  try {
    decodeURIComponent(req.path);
  } catch (e) {
    console.log(e);
    err.error = 'not a valid domain name';
    lib.sendResult(req, res, err, 400);
    return;
  }
  next();
});

// localhost:3000/alexa/get?d=codetabs.com => {d: 'codetabs.com'}
app.get('/get', function (req, res) {
  // console.log('==>', req.query.d)
  if (req.query.d) {
    job.getRankByDomainCPU(req, res, req.query.d);
  // job.getRankByDomainRAM(req, res, req.query.d)
  } else {
    lib.sendResult(req, res, {'error': 'Domain is empty'}, 400);
  }
});

// localhost:3000/alexa/get/codetabs.com => {"d":"codetabs.com"}
app.get('/get/:d', function (req, res) {
  // console.log('==>', req.params.d)
  job.getRankByDomainCPU(req, res, req.params.d);
// job.getRankByDomainRAM(req, res, req.params.d)
});

app.get('/*', function (req, res) {
  res.redirect('https://codetabs.com/notFound');
// res.status(404).send('Not Found')
});

module.exports = app;
