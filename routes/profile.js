var express = require('express');
var router = express.Router();

const FriendsService = require('../bin/services/FriendsService')
const UserService = require('../bin/services/UserService')
const PostService = require('../bin/services/PostService')
const authMdw = require('../bin/middleware/authMdw')

//get user page

router.get('/:username',authMdw ,async function(req, res)  {
    
    const username = req.params.username
    const theUser = req.user
    

    try {
        let user = await UserService.findByName(username)
        const accepted = await FriendsService.friends(user).exec()
        const pending = await FriendsService.friendRequestsPending(user)

        user = await PostService.getPosts(user)

        let friendsAccepted = await Promise.all(accepted.map(async (relation) =>{
           const friend = await UserService.findById(relation.friend_id, {
               tokens: false,
               password: false
           })
           return await PostService.getPosts(friend) 
        }
        ))

        const friendsPending = await Promise.all(pending.map(async (relation) => {
            return await UserService.findById(relation.user_id)
        }
        ))

        

        res.send({
            user : user,
            posts: await PostService.getAllPosts(user, friendsAccepted),
            friendsList: {
                accepted: friendsAccepted,
                pending: friendsPending
            },
            isRequestSend: Boolean(await FriendsService.hasSentRequest(theUser, user)),
            isRequestPending: Boolean(await FriendsService.hasFriendRequest(theUser, user)),
            isFriend: ((await FriendsService.isFriendWith(theUser, user)).length > 0) ? true: false,
        })
    } catch(e) {
        console.log(e)
        res.status(404).send({})
    }
})


router.get('/edit', authMdw, (req, res) => {

})


module.exports = router