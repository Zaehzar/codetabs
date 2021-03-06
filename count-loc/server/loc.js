/* */
const express = require('express');
const app = express();

require('dotenv').config({ path: __dirname + '/../../_lib/.env' });
const stats = require(__dirname + '/../../_lib/stats.js');
const lib = require(__dirname + '/../../_lib/lib.js');
const job = require(__dirname + '/locTask.js');

let port = 3000;
if (process.env.NODE_ENV === 'production') {
  port = process.env.PORT_LOC;
}

let folderID = 0;

app.disable('x-powered-by');

app.use(function (req, res, next) {
  res.locals.service = 'loc';
  stats.updateStats(req, res, next);
});

app.get('/get', function (req, res) {
  // console.log('GET')
  folderID++;
  job.repoLoc(req, res, folderID, function (response, status) {
    if (response.locs) {
      response = response.locs;
    }
    lib.sendResult(req, res, response, status);
  });
});

app.post('/upload', function (req, res) {
  // console.log('UPLOAD')
  folderID++;
  job.uploadLoc(req, res, folderID, function (response, status) {
    if (response.locs) {
      response = response.locs;
    }
    lib.sendResult(req, res, response, status);  });});

app.get('*', function (req, res) {
  res.redirect('https://codetabs.com/notFound');
// res.status(404).send('Not Found')
});

app.listen(port, function () {
  const time = new Date().toUTCString().split(',')[1];
  console.log('Express server on port ' + port + ' - ' + time);
  stats.testDB();
});

module.exports = app;
