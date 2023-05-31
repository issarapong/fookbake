exports.uploadImage = async ( req, res, next) => {
    try {
    //console.log(req.file) // single
    console.log(req.files)  // array
    } catch (err) {
        next(err)
    }
}