const express = require('express')
var router = express.Router();
const authMdw = require('../bin/middleware/authMdw')
const UserService = require('../bin/services/UserService')
const FriendsService = require('../bin/services/FriendsService')


router.post('/add', authMdw , async function(req, res) {
    const user = req.user
    
    const friend = await UserService.findById(req.body.friend_id)

    //dont try to befriend yourself
    if (user._id === friend._id) {
        return res.end()
    }

    //if no such user
    if(!friend) {
       return res.status(400).send({msg: 'No such user was found'})
    }
    
    //if friend reqest already was send
    if (Boolean(await FriendsService.hasSentRequest(user, friend)) 
     || Boolean(await FriendsService.hasFriendRequest(user, friend))) {
        return res.send({msg: 'Friend request is already pending'})
    }

    // if already are friends
    if (((await FriendsService.isFriendWith(user, friend)).length > 0) ? true: false) {
        return res.send({msg: 'You are friends with that user'})
    }

    await FriendsService.addFriend(user, friend)
    
    return res.send({msg:`You send reqest to ${friend.username}`})
})


router.post('/accept', authMdw , async function(req, res) {

    const user = req.user

    const friend = await UserService.findById(req.body.friend_id)

    if(!friend) {
        return res.status(400).send({msg: 'No such user was found'})
    }
      //if user did not have request pending from specific user(friend)
    if (!Boolean(await FriendsService.hasFriendRequest(user, friend))) {
         return res.send({msg: 'You dont have friend request from thar user'})
    }

       try {
            await FriendsService.acceptFriendRequest(user, friend)
            return res.send({msg: `You just added ${friend.email}`})
        } catch(e) {
            console.log(e)
        }
 })


 router.post('/remove' , authMdw, async function(req, res) {
     const user = req.user

     const friend = await UserService.findById(req.body.friend_id)

     if(!friend) {
        return res.status(400).send({msg: 'No such user was found'})
    }

    if (!((await  FriendsService.isFriendWith(user, friend)).length > 0) ? true: false) {
        return res.send({msg: 'You are not friends with that user'})
    }

    await FriendsService.deleteFriend(user, friend)

    return res.status(200).end()



 })
module.exports = router