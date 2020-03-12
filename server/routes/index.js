const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.json({ message: 'API its work. Happy coding!' });
});

module.exports = router;
