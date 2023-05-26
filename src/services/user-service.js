const userRepository = require('../repositories/user-repository')

exports.checkEmailOrMobileExist = emailOrMobile => {

    const existUser = userRepository.getUserByEmailMobile(emailOrMobile)
    return !!existUser;

};

exports.createUser = user => userRepository.createUser(user);