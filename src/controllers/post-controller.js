const fs = require("fs");

const createError = require("../utils/create-error");
const { Post, User, Like } = require("../models");

const uploadService = require("../services/upload-service");
const friendService = require("../services/friend-service");

exports.createPost = async (req, res, next) => {
  try {
    //validate  ต้องมีอย่างน้อย 1 ข้อความ หรือรูปภาพ
    // image => req.file, message => req.body

    if (!req.file && (!req.body.message || !req.body.message.trim())) {
      createError("message or image is required", 400);
    }
    const value = {
      userId: req.user.id,
    };
    if (req.body.message && req.body.message.trim()) {
      value.message = req.body.message.trim();
    }

    if (req.file) {
      const result = await uploadService.upload(req.file.path);
      value.image = result.secure_url;
    }
    const post = await Post.create(value);
    res.status(201).json({ post: post });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path); // สำหรับรูปเดียว
    }
  }
};

exports.getAllPostIncludeFriend = async (req, res, next) => {
  try {
    // 1, [2,3,4,5,6]
    // SELECT FROM posts WHERE userId = 1 OR userId = 2 Or userId =3
    //Select * FROM posts Where userid IN (1,2,3)
    const friendsId = await friendService.getFriendsByUserId(req.user.id);
    const meIncludeFriendsId = [req.user.id, ...friendsId];
    const posts = await Post.findAll({
      where: { userId: meIncludeFriendsId },
      order: [["createdAt", "DESC"]],
      include: [
        {
            model: User
        },
        {
            model: Like,
            include: User
        }
      ]
    });
    res.status(200).json({ posts });
    // Post.findAll({ where : {id: [1,2,3,4]}});
  } catch (err) {
    next(err);
  }
};


// exports.createLike = async (req,res,next) => {
//     try {
//       const existLike = await Like.findOne({where: {
//         userId: req.user.id,
//         postId: req.params.postId
//       }})

//       if(existLike) {
//         createError("already like this post", 400)
//       }
//       await Like.create({ userId: req.user.id, postId: req.params.postId});
//       res.status(201).json({ message: 'Success like'})
//     } catch (err) {
//         next(err)
//     }
// }

exports.toggleLike = async (req,res,next) => {
    try {
      const existLike = await Like.findOne({where: {
        userId: req.user.id,
        postId: req.params.postId
      }})

      if(existLike) {
        // await Like.destroy({

        //     where: {
        //         userId: req.user.id,
        //         postId: req.params.postId
        //     }

        // })

        await existLike.destroy();
      }else{
    
      
      await Like.create({ userId: req.user.id, postId: req.params.postId});
      }
     
      res.status(201).json({ message: 'Success like'})
    } catch (err) {
        next(err)
    }
}