const express = require('express')
const friendController = require('../controllers/friend-controller')

const router = express.Router();

router.post('/:receiverId', friendController.addFriend)  // add row "PENDING"
router.patch('/:requesterId', friendController.confirmFriend) // Change Row "Accept"
router.delete('/:receiverId/cancel',  friendController.cancelRequest)
router.delete('/:friendId/unfriend',  friendController.unfriend)   // delete row
router.delete('/:requesterId/reject',  friendController.rejectRequest)

module.exports = router


