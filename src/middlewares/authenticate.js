const createError = require("../utils/create-error");
const tokenService = require('../services/token-service')
const userService = require('../services/user-service')

module.exports = async (req, res, next) => {
    try {

        const authorization = req.headers.authorization;
        if (!authorization || !authorization.startsWith('Bearer ')) {
            createError('Unauthorized', 401)
        }
     
        const token= req.headers.authorization.split(' ')[1]     // Get Token key only
        if (!token) {
            createError('Unauthorized', 401)
        }
        const payload = tokenService.verify(token)
        const user = await userService.getUserById(payload.id)
        if(!user) {
            createError('unauthorized', 401)
        }

        req.user = user;
        next()  // ระบุ next เพื่อ ให้  auth-route (authenticateMiddleware,) ทำงานขั้นต่อไป router.get('/me',  authenticateMiddleware, authController.getMe)
    } catch (err) {
      next(err);
         
    }
}

