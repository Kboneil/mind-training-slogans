const router = require('express').Router();
const passport = require('passport');
const pool = require('../db/connection');
const schedule = require('node-schedule');


var rule = new schedule.RecurrenceRule();


var slogans = [];
var sloganOfTheDay;
getSlogans();


function timeout() {
  rule.second = 1;

  schedule.scheduleJob(rule, function(){

    if (slogans.length === 0) {
      console.log('getting all slogans');
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
            console.log('IF one slogan', slogans[0]);
            sloganOfTheDay = slogans[0];
            slogans.shift();

          });
        } finally {
          done();
        }
      });

    } else {
      console.log('ELSE one slogan', slogans[0]);
      sloganOfTheDay = slogans[0];
      slogans.shift();
    }
  });

}

function getSlogans() {
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
        console.log('slogans from db', slogans);
        sloganOfTheDay = slogans[0];
        slogans.shift();
        timeout();
      });
    } finally {
      done();
    }
  });
}

//gets all the content from favorites table

router.get('/', function (req, res) {
  console.log('in get function');
  res.send(sloganOfTheDay);
});

module.exports = router;
