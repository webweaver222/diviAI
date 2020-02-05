const express = require('express')
var router = express.Router();
const authMdw = require('../bin/middleware/authMdw')
const User = require('../bin/models/User')

router.post('/add', authMdw , async function(req, res) {
    const user = req.user
    
    const friend = await User.findById(req.body.friend_id)

    //if no such user
    if(!friend) {
        res.status(400).send({msg: 'No such user was found'})
        return
    }
    
    //TODO if friend reqest already was send


    //TODO if already are friends

    //TODO if try to befriend yourself

    await user.addFriend(friend)
    
    res.send({msg:`You send reqest to ${friend.username}`})
})


router.post('/accept', authMdw , async function(req, res) {

    const user = req.user
    try {
        const friend = await User.findById(req.body.friend_id)
    if (!friend) {
        res.status(400).send({msg: 'No such user was found'})
        return
    }


      //TODO if user did not have request pending from specific user(friend)

    await user.acceptFriendRequest(friend)
    
    res.end()
    } catch (e) {
        console.log(e)
    }

 })
module.exports = router