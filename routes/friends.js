const express = require('express')
var router = express.Router();
const authMdw = require('../bin/middleware/authMdw')
const User = require('../bin/models/User')


router.post('/add', authMdw , async function(req, res) {
    const user = req.user
    
    const friend = await User.findById(req.body.friend_id)

    //dont try to befriend yourself
    if (user._id === friend._id) {
        return res.end()
    }

    //if no such user
    if(!friend) {
       return res.status(400).send({msg: 'No such user was found'})
    }
    
    //if friend reqest already was send
    if (Boolean(await user.hasSentRequest(friend)) || Boolean(await user.hasFriendRequest(friend))) {
        return res.send({msg: 'Friend request is already pending'})
    }

    // if already are friends
    if (Boolean(await user.isFriendWith(friend))) {
        return res.send({msg: 'You are friends with that user'})
    }

    await user.addFriend(friend)
    
    return res.send({msg:`You send reqest to ${friend.username}`})
})


router.post('/accept', authMdw , async function(req, res) {

    const user = req.user

    const friend = await User.findById(req.body.friend_id)

    if(!friend) {
        return res.status(400).send({msg: 'No such user was found'})
    }
      //if user did not have request pending from specific user(friend)
    if (!Boolean(await user.hasFriendRequest(friend))) {
         return res.send({msg: 'You dont have friend request from thar user'})
    }

       try {
            await user.acceptFriendRequest(friend)
            return res.send({msg: `You just added ${friend.email}`})
        } catch(e) {
            console.log(e)
        }
 })
module.exports = router