const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../../config/keys')
const saltHash = 10;

// load module
const User = require('../../models/users.models')

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.json({
    message: 'users api ok.'
  });
});

router.post('/register', (req, res, next) => {
  User.findOne({
    email: req.body.email
  }).then((user) => {
    if (user) {
      return res.status(400).json({
        error: "email already exist."
      })
    } else if (req.body.password !== req.body.retypepassword) {
      return res.status(400).json({
        error: "password doesn't match."
      })
    } else {
      const newUser = new User({
        email: req.body.email,
        password: req.body.password
      })

      // hashing
      bcrypt.genSalt(saltHash, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              res.json({
                data: user.email
              })
            })
            .catch(err => console.error(err))
        })
      })
    }
  }).catch((err) => {
    console.error(err)
  });
})

module.exports = router;