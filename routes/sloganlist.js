const router = require('express').Router();
const passport = require('passport');
const pool = require('../db/connection');


var slogans = [];

//gets all the content from favorites table

router.get('/', function (req, res) {
  console.log('in get function');
  pool.connect(function (err, client, done) {
    try {
      if (err) {
        console.log('Error querying to DB', err);
        res.sendStatus(500);
        return;
      }

      client.query('SELECT * FROM slogans',
            function (err, result) {
              if (err) {
                console.log('Error querying DB', err);
                res.sendStatus(500);
                return;
              }
              slogans = result.rows;
              res.send(slogans);
            });
    } finally {
      done();
    }
  });
});

module.exports = router;
