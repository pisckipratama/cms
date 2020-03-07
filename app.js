const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport')
const db = require('./config/keys').mongoURI;

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/api/users');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

// connect to db
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://pisckipy:nopassword@reviewapi-a48cn.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
  })
  .then(() => console.log('successfully connected with mongodb.'))
  .catch(err => console.error(err))

// config passport
app.use(passport.initialize())
require('./config/passport')(passport)

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);

module.exports = app;