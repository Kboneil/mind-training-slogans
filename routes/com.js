const router = require('express').Router();
const passport = require('passport');
const pool = require('../db/connection');

var comments = [];

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

      client.query('SELECT comments.id, comment, date, slogan_id, user_id, point, slogan, extra FROM comments JOIN slogans ON slogans.id = slogan_id JOIN users ON users.id = user_id WHERE user_id = $1;', [currentlyLoggedInUser.id],
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

      client.query('SELECT comments.id, comment, date, slogan_id, user_id, point slogan, extra FROM comments JOIN slogans ON slogans.id = slogan_id JOIN users ON users.id = user_id WHERE slogan_id = $1 AND user_id = $2;', [id, currentlyLoggedInUser.id],
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
  var comment = req.body.comment
  var id = req.body.slogan_id;
  var date = req.body.date;
  pool.connect(function (err, client, done) {
    try {
      if (err) {
        console.log('Error querying to DB', err);
        res.sendStatus(500);
        return;
      }

      client.query('INSERT INTO comments (comment, date, slogan_id, user_id) VALUES ($1, $2, $3, $4);', [comment, date, id, currentlyLoggedInUser.id],
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

router.delete('/:id', function (req, res) {
  var id = req.params.id;
  pool.connect(function (err, client, done) {
    try {
      if (err) {
        console.log('Error connecting to DB', err);
        res.sendStatus(500);
        return;
      }
      client.query('DELETE FROM comments WHERE id=$1', [id], function (err) {
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


router.put('/:id', function (req, res) {
  var id = req.params.id;
  var comment = req.body.comment;

  pool.connect(function (err, client, done) {
    try {
      if (err) {
        console.log('Error querying to DB', err);
        res.sendStatus(500);
        return;
      }

      client.query('UPDATE comments SET comment=$1 WHERE id=$2 RETURNING *;',
      [comment, id],
      function (err, result) {
        if (err) {
          console.log('Error querying database', err);
          res.sendStatus(500);

        } else {
          console.log('result.rows', result.rows);
          res.send(result.rows);
        }
      });
    } finally {
      done();
    }
  });

});

module.exports = router;
