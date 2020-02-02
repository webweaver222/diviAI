var express = require('express');
var router = express.Router();
const User = require('../bin/models/User')
const authMdw = require('../bin/middleware/authMdw')

/* GET home page. */
router.get('/',authMdw, async function(req, res, next) {

  

  res.send({user: req.user})
});

module.exports = router;
