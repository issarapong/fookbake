const userRepository = require('../repositories/user-repository')

exports.checkEmailOrMobileExist = emailOrMobile => {

    const existUser = userRepository.getUserByEmailOrMobile(emailOrMobile)
    return !!existUser;

};

exports.createUser = user => userRepository.createUser(user);

exports.getUserByEmailOrMobile = async (emailOrMobile) => {
    
 const user = userRepository.getUserByEmailOrMobile(emailOrMobile);
 return user;

}

exports.getUserById = id => userRepository.getUserById(id)