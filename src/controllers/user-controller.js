const fs = require("fs");
const uploadService = require("../services/upload-service");
const createError = require("../utils/create-error");
const { User } = require("../models");

exports.uploadImage = async (req, res, next) => {
  try {
    //console.log(req.file) // single
    console.log(req.files); // array
    if (!req.files.profileImage && !req.files.coverImage) {
      createError("profile image or cover requird");
    }
   const updateValue ={};

    if (req.files.profileImage) {
      const result = await uploadService.upload(
        req.files.profileImage[0].path
      );
      updateValue.profileImage = result.secure_url;
    }
    if (req.files.coverImage) {
      const result = await uploadService.upload(
        req.files.coverImage[0].path
      );
      updateValue.coverImage = result.secure_url;
    }

    await User.update(updateValue, { where: { id: req.user.id } });
    res.status(200).json(updateValue);
    //console.log(result);
  } catch (err) {
    next(err);
  } finally {
    if (req.files.profileImage) {
      fs.unlinkSync(req.files.profileImage[0].path);
    }
    if (req.files.coverImage) {
      fs.unlinkSync(req.files.coverImage[0].path);
    }
  }
};
