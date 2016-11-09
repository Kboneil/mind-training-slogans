const twilio = require('twilio');
var clientTwilio = new twilio.RestClient('AC48b3cc30d5cdaa484b63d8110435c1be', '8143ab068cb139e0f618dc1c22211be6');
const router = require('express').Router();
const pool = require('../db/connection');
const schedule = require('node-schedule');

// console.log('jobs', schedule.scheduledJobs);

scheduleSMS();

function scheduleSMS () {

pool.connect(function (err, client, done) {
  try {
    if (err) {
      console.log('Error querying to DB', err);
      return;
    }

    client.query('SELECT * FROM users JOIN slogans ON slogans.id = daily',
          function (err, result) {
            if (err) {
              console.log('Error querying DB', err);
              return;
            }
            users = result.rows;

            //forEach user check to see if they want to receive slogan message
            users.forEach(function (user) {

              sendSMS(user);

            }); //end of forEach

          });//end of select query

  } finally {
    done();
  }
  });//end of pool.connect

} //end of scheduleSMS

function sendSMS(user) {
  //if no return
  if(user.messages === false){
    return
  }
  // if yes get the time of day and schedule a message to be sent
  var time = new Date (user.time)
  var hour = time.getHours();
  var minute = time.getMinutes();
  console.log('hour', hour);
  console.log('minute', minute);

  var rule = new schedule.RecurrenceRule();
    rule.hour = hour;
    rule.minute = minute;

    schedule.scheduleJob(user.username ,rule, function(){
      console.log('in rule');

      // send the slogan of the day to that user's number

      clientTwilio.sms.messages.create({

          to: user.number, // Any number Twilio can deliver to
          from: '17639511301', // A number you bought from Twilio and can use for outbound communication
          body: user.slogan // body of the SMS message

      }, function(err, responseData) { //this function is executed when a response is received from Twilio

          if (!err) { // "err" is an error received during the request, if any

              console.log(responseData.body); // outputs slogan of the day

          } else {
            console.log('error sending message');
          }
      });//end of send message
    });


}

module.exports = {
  sendSMS: sendSMS
}
