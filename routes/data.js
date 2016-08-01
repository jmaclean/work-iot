var express = require('express');
var router = express.Router();
var moment = require('moment');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/Users/jmaclean/projects/work-iot/work-iot.db');

router.post('/', function(req, res, next) {
  var body = req.body;
  var now = moment.now();
  db.serialize(function() {
    try {
      var insertStatement = db.prepare("INSERT INTO bathroom_events(bathroom_id, status, reported_at, reported_by) VALUES(?, ?, ?, ?)");
      insertStatement.run(body.bathroom_id, body.status, now.valueOf(), body.reported_by);
      insertStatement.finalize();
    } catch (e) {
      console.log(e);
    } finally {
      res.send('OK');
    }
  });
});

module.exports = router;
