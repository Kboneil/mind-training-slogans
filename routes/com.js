const router = require('express').Router();
const passport = require('passport');
const pool = require('../db/connection');

const User = require('../models/user');

var user_id;

exports.getId = function () {
  user_id = User.user_id
  console.log('id in comments', user_id);
}

var comments = [];

//gets all the content from favorites table

router.get('/', function (req, res) {
  exports.getId();
  console.log('in get function');
  pool.connect(function (err, client, done) {
    try {
      if (err) {
        console.log('Error querying to DB', err);
        res.sendStatus(500);
        return;
      }

      client.query('SELECT * FROM comments JOIN slogans ON slogans.id = slogan_id JOIN users ON users.id = user_id WHERE user_id = $1;', [user_id],
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

router.get('/:id', function (req, res) {
  exports.getId();
  console.log('id', id);
  var id = req.params.id;
  console.log('in get function');
  pool.connect(function (err, client, done) {
    try {
      if (err) {
        console.log('Error querying to DB', err);
        res.sendStatus(500);
        return;
      }

      client.query('SELECT * FROM comments JOIN slogans ON slogans.id = slogan_id JOIN users ON users.id = user_id WHERE slogan_id = $1 AND user_id = $2;', [id, user_id],
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
