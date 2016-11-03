const router = require('express').Router();
const passport = require('passport');
const pool = require('../db/connection');

router.get('/', function (req, res) {
  var currentlyLoggedInUser = req.user;
  console.log('in get function users');
  pool.connect(function (err, client, done) {
    try {
      if (err) {
        console.log('Error querying to DB', err);
        res.sendStatus(500);
        return;
      }

      client.query('SELECT * FROM users WHERE id = $1;', [currentlyLoggedInUser.id],
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

router.get('/logout', function(req, res){
    console.log("logging out");
    req.logout();
    res.send(200);
});

router.put('/', function (req, res) {
  console.log('in post request');
  var currentlyLoggedInUser = req.user;
  var answer = req.body.random;
  console.log('answer', answer);
  pool.connect(function (err, client, done) {
    try {
      if (err) {
        console.log('Error querying to DB', err);
        res.sendStatus(500);
        return;
      }
      //this changes the boolean value in users table
      client.query('UPDATE users SET random=$1 WHERE id = $2 RETURNING *', [answer, currentlyLoggedInUser.id],
            function (err, result) {
              if (err) {
                console.log('Error querying DB', err);
                res.sendStatus(500);
                return;
              }

              res.send(result.rows);
            });
            //after table is updated, the slogans is populated with an array of slogans id
            //either in order or randomly, according to the users response

            //if they want random slogans
            if (answer === 'true'){
              console.log('inside answer is true');
              //get a random order of numbers from 1-59

                  for (var a=[],i=0;i<60;++i) a[i]=i;


                  function shuffle(array) {
                    var tmp, current, top = array.length;
                    if(top) while(--top) {
                      current = Math.floor(Math.random() * (top + 1));
                      tmp = array[current];
                      array[current] = array[top];
                      array[top] = tmp;
                    }
                    return array;
                  }

                  a = shuffle(a);
                  var index = a.indexOf(0);
                  if (index > -1) {
                    a.splice(index, 1);
                    }
                  console.log('random array', a);

              client.query('UPDATE users SET slogans = ARRAY [' + a + '] WHERE id = $1', [currentlyLoggedInUser.id],
              function (err, result) {
                if (err) {
                  console.log('Error querying DB', err);
                  res.sendStatus(500);
                  return;
                }
                console.log('updated');
              });
              //else they get ordered slogans
            } else {
              client.query('UPDATE users SET slogans = ARRAY [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59] WHERE id = $1 RETURNING *', [currentlyLoggedInUser.id],
              function (err, result) {
                if (err) {
                  console.log('Error querying DB', err);
                  res.sendStatus(500);
                  return;
                }
                console.log('result.rows', result.rows[0].slogans[0]);


                var sloganOfTheDayId = result.rows[0].slogans[0];
                console.log('sloganOfTheDay else', sloganOfTheDayId);
                //remove that slogan
                result.rows[0].slogans.shift();
                console.log('after shift else', result.rows[0].slogans);
                //updates that users entry of slogan of the day
                client.query('UPDATE users SET daily=$1 WHERE id = $2 RETURNING *', [sloganOfTheDayId, currentlyLoggedInUser.id],
                      function (err, result) {
                        if (err) {
                          console.log('Error querying DB else', err);
                          res.sendStatus(500);
                          return;
                        }

                        console.log('slogan of the day updated');
                      });





              });//end update
            }


    } finally {
      done();
    }
  });
});

module.exports = router;
