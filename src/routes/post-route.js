const express = require('express')
const postController = require('../controllers/post-controller')
const upload = require('../middlewares/upload')

const router = express.Router();

router.post('/', upload.single('image'), postController.createPost)   // filed name image "upload.single('image')"
router.get('/friends', postController.getAllPostIncludeFriend)
//router.post('/:postId/like', postController.createLike)
router.post('/:postId/like', postController.toggleLike)
module.exports = router;