var express = require('express');
var router = express.Router();
const UserService = require('../bin/services/UserService')
const authMdw = require('../bin/middleware/authMdw')


router.post('/signup', async function(req, res) {
  
    let user = UserService.createUser(req.body)

    //TODO validation


    //register new user
    try {
        user  = await user.save()
        const token = await UserService.generateAuthToken(user)
        return res.cookie('user', token).send({user})
    } catch (e) {
      return res.send({message: e.message})
    }

  });
  

  //login
  router.post('/signin', async function(req, res) {
    try {
        const user = await UserService.findByCred(req.body.email, req.body.password)
        const token = await UserService.generateAuthToken(user) 
        res.cookie('user', token).send({user})
    } catch (e) {
      console.log(e)
        res.status(400).send({message: e.message})
    }
  

    
  });



  router.post('/logout', authMdw, async function(req, res) {
    try {
      req.user.tokens =  req.user.tokens.filter(token => {
        return token.token != req.token
      })
      await req.user.save()

      res.clearCookie("user").end()
    } catch(e) {
        res.status(500).send({msg: e})
    }
    
  })


  module.exports = router;