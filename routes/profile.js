var express = require('express');
var router = express.Router();
const User = require('../bin/models/User')
const authMdw = require('../bin/middleware/authMdw')

//get user page


router.get('/:user_id', async function(req, res)  {
    
    const user_id = req.params.user_id

    try {
        const user = await User.findById(user_id)
        
        res.send({user})
    } catch(e) {
        res.status(400).send({message: e.message})
    }
})


router.get('/edit', authMdw, (req, res) => {

})



module.exports = router