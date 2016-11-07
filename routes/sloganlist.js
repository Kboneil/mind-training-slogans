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

//gets search slogans

router.get('/search/', function (req, res) {
   var search = req.query.q;
   console.log('search', search);

  pool.connect(function (err, client, done) {
    if (err) {
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      done();
      return;
    }

//this catches when the nothing is searched and selects the whole list
    if (!search) {

      client.query('SELECT * FROM slogans;', function (err, result) {
        done();
        if (err) {
          console.log('Error querying DB', err);
          res.sendStatus(500);
          return;
        }

        console.log('All rows from empty search:', result.rows);
        res.send(result.rows);
      });


//otherwise it takes the search and selects only what is searched
    } else {

      client.query('SELECT * FROM slogans WHERE slogan ILIKE $1 OR point ILIKE $1 OR extra ILIKE $1;', ['%' + search + '%'], function (err, result) {
        done();
        if (err) {
          console.log('Error querying the DB on search', err);
          res.sendStatus(500);
          return;
        }

        console.log('DB rows from search:', result.rows);
        res.send(result.rows);
      });

  }

  });
});

module.exports = router;
