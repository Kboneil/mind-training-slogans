const router = require('express').Router();
const passport = require('passport');
const pool = require('../db/connection');

router.post('/', passport.authenticate('local'), function(req, res){
  pool.connect(function (err, client, done) {
    try {
      if (err) {
        console.log('Error querying to DB', err);
        res.sendStatus(500);
        return;
      }

      client.query('INSERT INTO users (logged_in) VALUES (true) RETURNING *;',
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
  res.sendStatus(200);
});

module.exports = router;
