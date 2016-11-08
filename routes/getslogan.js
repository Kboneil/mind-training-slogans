const router = require('express').Router();
const passport = require('passport');
const pool = require('../db/connection');
const schedule = require('node-schedule');


var rule = new schedule.RecurrenceRule();

//get the slogan on the day
router.get('/', function(req, res) {
  var currentlyLoggedInUser = req.user
  console.log(currentlyLoggedInUser.id);
  pool.connect(function (err, client, done) {
    try {
      if (err) {
        console.log('Error querying DB 1', err);
        res.sendStatus(500);
        return;
      }
      client.query('SELECT users.id, daily, point, slogan, extra FROM users JOIN slogans ON slogans.id = daily WHERE users.id=$1;', [currentlyLoggedInUser.id],
            // client.query('SELECT * FROM users JOIN slogans ON slogans.id = daily',
          function (err, result) {
            if (err) {
              console.log('Error querying DB 2', err);
              res.sendStatus(500);
              return;
            }
            res.send(result.rows)
          });//end of client.query
    }finally {
      done();
    }
  })//end of pool.connect
}); //end of get

//---------------------starts the daily slogan schedule-------------------------

timeoutDaily();

//--------------------------------daily slogan----------------------------------

function timeoutDaily() {
  rule.hour = 0;
  rule.minute = 05;



  schedule.scheduleJob(rule, function() {

    //get all users

      pool.connect(function (err, client, done) {
        try {
          if (err) {
            console.log('Error querying to DB', err);
            return;
          }

          client.query('SELECT * FROM users',
                function (err, result) {
                  if (err) {
                    console.log('Error querying DB', err);
                    return;
                  }
                  users = result.rows;

                  //forEach user check to see if array is empty
                  users.forEach(function (user) {

                    //if it is empty and the user wants ordered slogans, get a new ordered array
                    if (user.slogans[0] === 60 && user.random === false) {

                      client.query('UPDATE users SET slogans = ARRAY [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59] WHERE id = $1', [user.id],
                      function (err, result) {
                        if (err) {
                          console.log('Error querying DB', err);
                          return;
                        }
                        console.log('ordered array updated');
                      });//end of update query

                    //if it is empty and the user wants random slogans, get a new random array
                  } else if (user.slogans[0] === 60 && user.random === true) {

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

                client.query('UPDATE users SET slogans = ARRAY [' + a + '] WHERE id = $1', [user.id],
                function (err, result) {
                  if (err) {
                    console.log('Error querying DB', err);
                    return;
                  }
                  console.log('random array updated');
                }); //end of update query

              }//end of else if

                  //then get a new slogan of the day and change that in the database
                        client.query('SELECT * FROM users WHERE id = $1', [user.id],
                              function (err, result) {
                                if (err) {
                                  console.log('Error querying DB select', err);
                                  return;
                                }

                                var sloganOfTheDayId = result.rows[0].slogans[0];
                                //remove that slogan
                                result.rows[0].slogans.shift();
                                var array = result.rows[0].slogans;

                                //it can't take in an empty array, so the value becomes 60
                                //and when it loops through the next day, it will catch 60 and
                                //replace it with the appropriate array
                                if (array.length === 0 ){
                                  array.push(60);
                                  console.log('array 60?', array);
                                }


                                //updates that users entry of slogan of the day
                                client.query('UPDATE users SET daily=$1, slogans = ARRAY [' + array + '] WHERE id = $2 RETURNING *', [sloganOfTheDayId, result.rows[0].id],
                                      function (err, result) {
                                        if (err) {
                                          console.log('Error querying DB else', err);
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
                                      });// end of update query
                                }); //end of select query

                  }); //end of forEach

                });//end of select query

        } finally {
          done();
        }
      });//end of pool.connect


});//end of schedule function
} //end of timeout


module.exports = router;
