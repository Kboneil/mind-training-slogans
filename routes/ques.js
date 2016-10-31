const router = require('express').Router();
const passport = require('passport');
const pool = require('../db/connection');

var questions = [];

//gets all the content from favorites table

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

      client.query('SELECT * FROM questions JOIN slogans ON slogans.id = slogan_id JOIN users ON users.id = user_id WHERE user_id = $1;', [currentlyLoggedInUser.id],
            function (err, result) {
              if (err) {
                console.log('Error querying DB', err);
                res.sendStatus(500);
                return;
              }
              questions = result.rows;
              res.send(questions);
            });
    } finally {
      done();
    }
  });
});

router.get('/:id', function (req, res) {
  var currentlyLoggedInUser = req.user;
  var id = req.params.id;
  console.log('in get function');
  pool.connect(function (err, client, done) {
    try {
      if (err) {
        console.log('Error querying to DB', err);
        res.sendStatus(500);
        return;
      }

      client.query('SELECT * FROM questions JOIN slogans ON slogans.id = slogan_id JOIN users ON users.id = user_id WHERE slogan_id = $1 AND user_id = $2;', [id, currentlyLoggedInUser.id],
            function (err, result) {
              if (err) {
                console.log('Error querying DB', err);
                res.sendStatus(500);
                return;
              }
              comments = result.rows;
              res.send(comments);
            });
    } finally {
      done();
    }
  });
});

module.exports = router;
