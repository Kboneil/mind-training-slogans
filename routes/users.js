const router = require('express').Router();
const passport = require('passport');
const pool = require('../db/connection');

router.get('/', function (req, res) {
  var currentlyLoggedInUser = req.user;
  console.log('in get function users');
  pool.connect(function (err, client, done) {
    try {
      if (err) {
        console.log('Error querying to DB', err);
        res.sendStatus(500);
        return;
      }

      client.query('SELECT * FROM users WHERE id = $1;', [currentlyLoggedInUser.id],
            function (err, result) {
              if (err) {
                console.log('Error querying DB', err);
                res.sendStatus(500);
                return;
              }
              res.send(result.rows);
            });
    } finally {
      done();
    }
  });
});

module.exports = router;
