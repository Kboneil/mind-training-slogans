// require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./db/connection');
const path = require('path');
const login = require('./routes/login');
const register = require('./routes/register');
const getslogan = require('./routes/getslogan');
const sloganlist = require('./routes/sloganlist');
const comments = require('./routes/com');
const questions = require('./routes/ques');
const users = require('./routes/users');
const date = require('./routes/date');
// const twilio = require('./routes/twilio');
const auth = require('./auth/setup');
const passport = require('passport');
const session = require('express-session');
const user = require('./models/user');


auth.setup();

const sessionConfig = {
  secret: 'super secret key goes here',
  key: 'user',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 30 * 60 * 1000,
    secure: false
  }
};


// auth.setup();

const app = express();


app.use(session(sessionConfig));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());



app.use('/login', login);
app.use('/register', register);

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'public/views/index.html'));
});

app.use(ensureAuthenticated);

//put all other uses here***
app.use('/getslogan', getslogan);
app.use('/sloganlist', sloganlist);
app.use('/com', comments);
app.use('/ques', questions);
app.use('/date', date);
app.use('/users', users);

app.get('/*', function(req, res){
  res.sendFile(path.join(__dirname, 'public/views/index.html'));
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.sendStatus(401);
  }
}

var server = app.listen(process.env.PORT, function() {
  console.log('Listening on port', process.env.PORT);
});
