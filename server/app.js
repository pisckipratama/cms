const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors())

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
