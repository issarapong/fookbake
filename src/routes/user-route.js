const express = require('express')
const upload = require('../middlewares/upload')
const userController = require('../controllers/user-controller')
const router = express.Router();

//router.patch('/image', upload.array('abcde'), userController.uploadImage)   //single 1 รูป  / array หลายรูป
router.patch('/image', upload.fields([
    { name: 'abcde', maxCount:3 },
    { name: 'zyx', maxCount: 1}
]), userController.uploadImage)  //fields คือ upload ได้หลาย key maxCount คือ limit file
module.exports = router;