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

      client.query('SELECT questions.id, question, date, slogan_id, user_id, point slogan, extra  FROM questions JOIN slogans ON slogans.id = slogan_id JOIN users ON users.id = user_id WHERE user_id = $1;', [currentlyLoggedInUser.id],
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

router.delete('/:id', function (req, res) {
  var id = req.params.id;
  pool.connect(function (err, client, done) {
    try {
      if (err) {
        console.log('Error connecting to DB', err);
        res.sendStatus(500);
        return;
      }
      client.query('DELETE FROM questions WHERE id=$1', [id], function (err) {
        if (err) {
          console.log('Error querying DB', err);
          res.sendStatus(500);
          return;
        }
        res.sendStatus(204);
      });
    }finally {
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

      client.query('SELECT questions.id, question, date, slogan_id, user_id, point slogan, extra FROM questions JOIN slogans ON slogans.id = slogan_id JOIN users ON users.id = user_id WHERE slogan_id = $1 AND user_id = $2;', [id, currentlyLoggedInUser.id],
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

router.post('/', function (req, res) {
  console.log('in post request');
  var currentlyLoggedInUser = req.user;
  var question = req.body.question
  var id = req.body.slogan_id;
  var date = req.body.date;
  pool.connect(function (err, client, done) {
    try {
      if (err) {
        console.log('Error querying to DB', err);
        res.sendStatus(500);
        return;
      }

      client.query('INSERT INTO questions (question, date, slogan_id, user_id) VALUES ($1, $2, $3, $4);', [question, date, id, currentlyLoggedInUser.id],
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
