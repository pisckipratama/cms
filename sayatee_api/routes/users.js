const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRound = 10;
const User = require('../models/User')

/* GET users main. */
router.get('/', (req, res, next) => {
  res.json({
    message: `API's users work`
  });
});

/* POST register user */
router.post('/register', (req, res, next) => {
  const {
    name,
    email,
    password,
    retypepassword
  } = req.body

  let response = {
    status: false,
    message: '',
    data: {},
    token: ''
  }

  if (password === retypepassword) {
    User.findOne({
      email
    }).then(result => {
      if (result) {
        response.message = "email already exists, please try another email.";
        res.json(response)
      } else {
        bcrypt.hash(password, saltRound, (err, hash) => {
          if (err) res.send(err)
          else {
            const token = jwt.sign({
              email: email
            }, 'aplikasiaingkumahaaing');
            const user = new User({
              name: name,
              email: email,
              password: hash,
              token: token
            })
            user.save().then(data => {
              response.status = true;
              response.message = 'Register success';
              response.data.email = email;
              response.token = token;
              res.json(response)
            }).catch(err => res.status(500).json(err))
          }
        })
      }
    })
  } else {
    response.message = "password doesn't match"
    res.json(response)
  }
})

/* POST login user */
router.post('/login', (req, res, next) => {
  const {
    email,
    password
  } = req.body
  let response = {
    status: false,
    message: '',
    data: {},
    token: ''
  }

  User.find({
    email
  }).then(result => {
    if (result) {
      bcrypt.compare(password, result[0].password, (err, data) => {
        if (err) {
          response.message = "Auth failed"
          res.status(401).json(response)
        } else if (data) {
          const newToken = jwt.sign({
            email: result[0].email,
            id: result[0]._id
          }, 'aplikasiaingkumahaaing')
          response.status = true;
          response.message = 'Login successfull';
          response.data.email = email;
          response.token = newToken;
          User.updateOne({
            email
          }, {
            token: newToken
          }, (err => {
            if (err) {
              response.message = "Error!";
              res.status(401).json(response)
            } else {
              res.status(200).json(response);
              // res.redirect('http://localhost:3023/home');
            }
          }))
        } else {
          response.message = "Wrong email or password!";
          res.status(401).json(response);
        }
      })
    } else {
      response.message = "Auth Failed";
      res.status(401).json(response);
    }
  }).catch(err => {
    response.message = "Email or password is not valid";
    res.status(401).json(response)
  })
})

/* GET list users */
router.get('/list', (req, res, next) => {
  User.find().then(response => {
    res.status(200).json(response)
  }).catch(err => res.status(500).json(err))
})

/* POST check user's token */
router.post('/check', (req, res, next) => {
  let header = req.headers.authorization
  let response = {
    valid: false
  }

  if (typeof header !== undefined) {
    let checkToken = jwt.verify(header, 'aplikasiaingkumahaaing')
    User.find({
      email: checkToken.email
    }).then(result => {
      if (result) {
        response.valid = true;
        res.status(200).json(response)
      } else {
        res.status(500).json(response)
      }
    }).catch(err => {
      res.status(500).json(err)
    })
  } else {
    res.status(500).json(response)
  }
})


module.exports = router;