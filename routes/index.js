var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(process.env.DATABASE_PATH);

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('bathroom_status', {bathroom_statuses: []});
  db.serialize(function() {
    var sql = "WITH last_status(bathroom_id, reported_at) AS (\n" +
    "SELECT be.bathroom_id, max(be.reported_at)\n" +
    "FROM bathroom_events be\n" +
    "GROUP BY be.bathroom_id\n" +
    ")\n" +
    "SELECT b.name, be.status, be.reported_at, be.reported_by\n" +
    "FROM bathrooms b\n" +
    "JOIN bathroom_events be ON b.id = be.bathroom_id\n" +
    "JOIN last_status ls ON b.id = ls.bathroom_id\n" +
    "WHERE be.reported_at = ls.reported_at;";

    db.all(sql, function (err, rows) {
      if (err) {
        res.render('error', {'title': 'Error', 'message': 'ERROR ERROR', error: err});
      } else {
        res.render('bathroom_status', {bathroom_statuses: rows});
      }
    });
  });


});

module.exports = router;
