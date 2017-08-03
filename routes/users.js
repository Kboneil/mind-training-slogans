const router = require('express').Router();
const passport = require('passport');
const pool = require('../db/connection');
const fromTwilio = require('./twilio');
const schedule = require('node-schedule');
const twilio = require('twilio');
var clientTwilio = new twilio.RestClient('AC48b3cc30d5cdaa484b63d8110435c1be', '8143ab068cb139e0f618dc1c22211be6');

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

      client.query('SELECT daily, frequency, id, messages, name, number, random, slogans, time, username FROM users WHERE id = $1;', [currentlyLoggedInUser.id],
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

  var currentlyLoggedInUser = req.user;
  var answer = req.body.random;
  var name = req.body.name;
  var messages = req.body.messages;
  var time = req.body.time;
  var number = req.body.number;

  pool.connect(function (err, client, done) {
    try {
      if (err) {
        console.log('Error querying to DB', err);
        res.sendStatus(500);
        return;
      }
      //this changes the boolean value in users table
      client.query('UPDATE users SET random=$1, name=$2, messages=$3, time=$4, number=$5 WHERE id = $6 RETURNING *', [answer, name, messages, time, number, currentlyLoggedInUser.id],
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


              client.query('UPDATE users SET slogans = ARRAY [' + a + '] WHERE id = $1 RETURNING *', [currentlyLoggedInUser.id],
              function (err, result) {
                if (err) {
                  console.log('Error querying DB', err);
                  res.sendStatus(500);
                  return;
                }

                var sloganOfTheDayId = result.rows[0].slogans[0];

                //remove that slogan
                result.rows[0].slogans.shift();
                var array = result.rows[0].slogans;

                //updates that users entry of slogan of the day
                client.query('UPDATE users SET daily=$1, slogans = ARRAY [' + array + '] WHERE id = $2 RETURNING *', [sloganOfTheDayId, currentlyLoggedInUser.id],
                      function (err, result) {
                        if (err) {
                          console.log('Error querying DB else', err);
                          res.sendStatus(500);
                          return;
                        }
                        var date = new Date();
                        client.query('INSERT INTO slogan_date (date, slogan_id, user_id) values ($1, $2, $3) RETURNING *', [date, sloganOfTheDayId, result.rows[0].id],
                              function (err, result) {
                                if (err) {
                                  console.log('Error querying DB', err);
                                  return;
                                }

                                console.log('new slogan information updated');
                              });

                        // check to see if they want an SMS
                        client.query('SELECT * FROM users JOIN slogans ON slogans.id = daily WHERE users.id = $1', [currentlyLoggedInUser.id],
                              function (err, result) {
                                if (err) {
                                  console.log('Error querying DB', err);
                                  return;
                                }

                                fromTwilio.sendSMS(result.rows[0]);

                        });
                      });


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

                var sloganOfTheDayId = result.rows[0].slogans[0];

                //remove that slogan
                result.rows[0].slogans.shift();
                var array = result.rows[0].slogans;

                //updates that users entry of slogan of the day
                client.query('UPDATE users SET daily=$1, slogans = ARRAY [' + array + '] WHERE id = $2 RETURNING *', [sloganOfTheDayId, currentlyLoggedInUser.id],
                      function (err, result) {
                        if (err) {
                          console.log('Error querying DB else', err);
                          res.sendStatus(500);
                          return;
                        }

                        var date = new Date();
                        client.query('INSERT INTO slogan_date (date, slogan_id, user_id) values ($1, $2, $3) RETURNING *', [date, sloganOfTheDayId, result.rows[0].id],
                              function (err, result) {
                                if (err) {
                                  console.log('Error querying DB', err);
                                  return;
                                }

                                console.log('new slogan information updated');
                              });

                        // check to see if they want an SMS
                        client.query('SELECT * FROM users JOIN slogans ON slogans.id = daily WHERE users.id = $1', [currentlyLoggedInUser.id],
                              function (err, result) {
                                if (err) {
                                  console.log('Error querying DB', err);
                                  return;
                                }
                                fromTwilio.sendSMS(result.rows[0]);
                                console.log('jobs', schedule.scheduledJobs);
                        });

                      });
              });//end update


            }



    } finally {
      done();
    }
  });
});

//this will update returning user preferences but will not change the slogan of the day.
router.put('/returning', function (req, res) {
  var currentlyLoggedInUser = req.user;
  var answer = req.body.random;
  var name = req.body.name;
  var messages = req.body.messages;
  var time = req.body.time;
  var number = req.body.number;

  pool.connect(function (err, client, done) {
    try {
      if (err) {
        console.log('Error querying to DB', err);
        res.sendStatus(500);
        return;
      }
      //this changes the boolean value in users table
      client.query('UPDATE users SET random=$1, name=$2, messages=$3, time=$4, number=$5 WHERE id = $6 RETURNING *', [answer, name, messages, time, number, currentlyLoggedInUser.id],
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

              client.query('UPDATE users SET slogans = ARRAY [' + a + '] WHERE id = $1 RETURNING *', [currentlyLoggedInUser.id],
              function (err, result) {
                if (err) {
                  console.log('Error querying DB', err);
                  res.sendStatus(500);
                  return;
                }
                console.log('returning user array updated');
                // check to see if they want an SMS
                console.log('currently', currentlyLoggedInUser.id);
                client.query('SELECT * FROM users JOIN slogans ON slogans.id = daily WHERE users.id = $1', [currentlyLoggedInUser.id],
                      function (err, result) {
                        if (err) {
                          console.log('Error querying DB', err);
                          return;
                        }
                                    console.log('jobs before', schedule.scheduledJobs);
                                    console.log('username', result.rows[0].username);
                                    if(!schedule.scheduledJobs[result.rows[0].username]){
                         schedule.scheduledJobs[result.rows[0].username].cancel();};
                          fromTwilio.sendSMS(result.rows[0]);
                          console.log('jobs finished', schedule.scheduledJobs);


                });


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
                console.log('returning user array updated');
                // check to see if they want an SMS
                console.log('currently', currentlyLoggedInUser.id);
                client.query('SELECT * FROM users JOIN slogans ON slogans.id = daily WHERE users.id = $1', [currentlyLoggedInUser.id],
                      function (err, result) {
                        if (err) {
                          console.log('Error querying DB', err);
                          return;
                        }
                        console.log('jobs before', schedule.scheduledJobs);
                        if(!schedule.scheduledJobs[result.rows[0].username]){
                         schedule.scheduledJobs[result.rows[0].username].cancel();};
                          fromTwilio.sendSMS(result.rows[0]);


                          console.log('jobs finished', schedule.scheduledJobs);


                });

              });//end update


            }


    } finally {
      done();
    }
  });
});

module.exports = router;
