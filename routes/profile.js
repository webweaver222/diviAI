var express = require('express');
var router = express.Router();
const User = require('../bin/models/User')
const authMdw = require('../bin/middleware/authMdw')

//get user page


router.get('/:username',authMdw ,async function(req, res)  {
    
    const username = req.params.username
    const theUser = req.user
    

    try {
        const user = await User.findOne({username})

        console.log(Boolean(await theUser.isFriendWith(user)))
        const relations = await theUser.friends().exec()

        const friends = await Promise.all(relations.map(async function(relation) {
            return await User.findById(relation.friend_id, {
                password: false,
                tokens: false,
                timestamp: false
            })
        }
        ))
        

      

        res.send({
            user : user,
            friendsList: friends,
            isRequestSend: Boolean(await theUser.hasSentRequest(user)),
            isRequestPending: Boolean(await theUser.hasFriendRequest(user)),
            isFriend: ((await theUser.isFriendWith(user)).length > 0) ? true: false,
        })
    } catch(e) {
        console.log(e)
        res.status(404).send({})
    }
})


router.get('/edit', authMdw, (req, res) => {

})



module.exports = router