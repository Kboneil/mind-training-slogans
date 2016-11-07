const router = require('express').Router();
const passport = require('passport');
const pool = require('../db/connection');


router.get('/', function (req, res) {
  var currentlyLoggedInUser = req.user;
  console.log('in get date function');
  pool.connect(function (err, client, done) {
    try {
      if (err) {
        console.log('Error querying to DB', err);
        res.sendStatus(500);
        return;
      }

      client.query('SELECT * FROM slogan_date JOIN slogans ON slogans.id = slogan_id JOIN users ON users.id = user_id WHERE user_id = $1;', [currentlyLoggedInUser.id],
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
