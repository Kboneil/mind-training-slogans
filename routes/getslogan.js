const router = require('express').Router();
const passport = require('passport');
const pool = require('../db/connection');
const schedule = require('node-schedule');

//for each user they will have the particular slogan of the day updated
var rule = new schedule.RecurrenceRule();

function timeout() {
  // rule.hour = 00;
  // rule.minute = 00;
  rule.second = 00;

  schedule.scheduleJob(rule, function(){

//first get all the users
router.get('/', function (req, res) {
  console.log('in get function users');
  pool.connect(function (err, client, done) {
    try {
      if (err) {
        console.log('Error querying to DB', err);
        res.sendStatus(500);
        return;
      }

      client.query('SELECT * FROM users',
            function (err, result) {
              if (err) {
                console.log('Error querying DB', err);
                res.sendStatus(500);
                return;
              }

              //next forEach user

              result.rows.forEach( function (user){

                //get the slogan array
                var slogans = user.slogans;

                //if all slogans have been removed, it needs to be refilled
                if (slogans.length === 0 && user.random === FALSE) {
                  console.log('getting all slogans');
                  pool.connect(function (err, client, done) {
                    try {
                      if (err) {
                        console.log('Error querying to DB', err);
                        res.sendStatus(500);
                        return;
                      }
                      client.query('UPDATE users SET slogans = ARRAY [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59] WHERE id = $1', [user.id],
                      function (err, result) {
                        if (err) {
                          console.log('Error querying DB', err);
                          res.sendStatus(500);
                          return;
                        }
                        console.log('refilled ordered slogans');
                      });
                    } finally {
                      done();
                    }
                  });
                } else {



                console.log('before shift', slogans);
                var sloganOfTheDay = users.slogans[1];
                console.log('sloganOfTheDay', sloganOfTheDay);
                //remove that slogan
                users.slogans.shift();
                console.log('after shift', slogans);


              })


              res.send(result.rows);
            });
    } finally {
      done();
    }
  });
});


}//ends schedule






var rule = new schedule.RecurrenceRule();


var slogans = [];
var sloganOfTheDay;
getSlogans();


function timeout() {
  rule.hour = 00;
  rule.minute = 00;
  rule.second = 00;

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
            slogans.push();

          });
        } finally {
          done();
        }
      });

    } else {
      console.log('ELSE one slogan', slogans[0]);
      sloganOfTheDay = slogans[0];
      slogans.push();
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
