const express = require('express')
const router = express.Router()
const authMdw = require('../bin/middleware/authMdw')

const PostService = require('../bin/services/PostService')


const processPost = async function(req, res) {
    if (req.body.post === '') return res.end()

    const postBody = req.body.post
    const parentPostId = req.body.parent_id? req.body.parent_id : null
    const user = req.user
    
    if (parentPostId) {
        const parentPost = await PostService.findById(parentPostId)
        if (!parentPost)  return res.status(400).send("cant find that post")
    }

    const post = PostService.createPost({
        body:  postBody,
        user:  user._id,
        parent: parentPostId
    })

    user.posts = user.posts.concat(post._id)

    await user.save()
    await post.save()

    return res.end()
}

router.post('/', authMdw, processPost)

router.post('/reply', authMdw, processPost)













router.post('/edit', authMdw, async (req, res) => { 

})


router.post('/delete', authMdw, async (req, res) => { 

})





module.exports = router