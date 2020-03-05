var express = require('express');
var router = express.Router();
const User = require('../bin/models/User')
const authMdw = require('../bin/middleware/authMdw')

//get user page


router.get('/:user_id',authMdw ,async function(req, res)  {
    
    const user_id = req.params.user_id
    const theUser = req.user
    

    try {
        const user = await User.findById(user_id)
        
        res.send({
            user : user,
            isRequestSend: Boolean(await theUser.hasSentRequest(user)),
            isRequestPending: Boolean(await theUser.hasFriendRequest(user)),
            isFriend: Boolean(await theUser.isFriendWith(user))
        })
    } catch(e) {
        res.status(404).send({})
    }
})


router.get('/edit', authMdw, (req, res) => {

})



module.exports = router