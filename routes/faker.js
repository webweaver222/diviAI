var express = require('express');
var router = express.Router();
const authMdw = require('../bin/middleware/authMdw')
const adminMdw = require('../bin/middleware/adminMdw')
const UserService = require('../bin/services/UserService')



router.post('/', [authMdw, adminMdw] , async function(req, res) {
    const promieses = []

    for (let i = 5; i < 100; i++) {
      promieses.push(async () => {
        let user = UserService.createUser({username: `${i}`, email: `${i}`, password: ''})
        user.save()
      })
    }

    await Promise.all(promieses)

    return res.end()
})

module.exports = router;