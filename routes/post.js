const express = require('express')
const router = express.Router()
const authMdw = require('../bin/middleware/authMdw')

const PostService = require('../bin/services/PostService')


const processPost = async function(req, res) {
    if (req.body.post === '') return res.end()
    console.log(req.body)
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

   
    await post.save()

    return res.end()
}

router.post('/', authMdw, processPost)

router.post('/reply', authMdw, processPost)



router.post('/edit', authMdw, async (req, res) => { 
    const {text, post_id} = req.body
    if (text === '' || text === null)  return res.end()

    const post = await PostService.findById(post_id)

    await post.update({body: text})

    
    return res.status(200).end()
})


router.post('/delete', authMdw, async (req, res) => {
    const {post_id} = req.body
    if (post_id == null) return res.end()

    await PostService.deleteAll({parent: post_id})

    await PostService.deleteById(post_id)
    return res.end()
})





module.exports = router