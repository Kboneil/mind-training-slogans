const router = require('express').Router();
const passport = require('passport');
const pool = require('../db/connection');

router.post('/', function (req, res) {
  console.log('in post request');
  var currentlyLoggedInUser = req.user;
  var id = req.body.slogan_id;
  var date = req.body.date;
  console.log('in post function date', date);
  console.log('in post function id', id);
  console.log('in post function currentlyLoggedInUser', currentlyLoggedInUser);
  pool.connect(function (err, client, done) {
    try {
      if (err) {
        console.log('Error querying to DB', err);
        res.sendStatus(500);
        return;
      }

      client.query('INSERT INTO slogan_date (date, slogan_id, user_id) values ($1, $2, $3) RETURNING *', [date, id, currentlyLoggedInUser.id],
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

router.get('/', function (req, res) {
  var currentlyLoggedInUser = req.user;
  console.log('in get function');
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
