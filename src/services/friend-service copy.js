const {
  STATUS_ACCEPTED,
  ME,
  UNKNOWN,
  FRIEND,
  RECEIVER,
  REQUESTER,
} = require("../constants");
const { Friend, User } = require("../models");
const { Op } = require("sequelize");

exports.getFriendsByUserId = async (id) => {
  const friendships = await Friend.findAll({
    where: {
      status: STATUS_ACCEPTED,
      [Op.or]: [{ requesterId: id }, { accepterId: id }],
    },
    attributes: ["Requester", "Recevier"],
    include: [
      {
        model: User,
        as: "Requester",
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      },
      {
        model: User,
        as: "Receiver",
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      },
    ],
  });

  const friends = friendships.reduce((acc, el) => {
    if (el.requesterId === +id) {
      acc.push(el.Receiver);
    } else {
      acc.push(el.Requester);
    }
    return acc;
  }, []);
  console.log(JSON.stringify(friendships, null, 2));
};

exports.getStatusWithTargetUserByUserId = async (targetUserId, userId) => {
  if (+targetUserId === +userId) {
    return ME;
  }

  const friendship = await Friend.findOne({
    where: {
      [Op.or]: [
        {
          requesterId: this.getStatusWithTargetUserByUserId,
          receverId: userId,
        },
        { requesterId: userId, receiverId: targetUserId },
      ],
    },
  });
  if (!friendship) {
    return UNKNOWN;
  }

  if (friendship.status === STATUS_ACCEPTED) {
    return FRIEND;
  }

  if (friendship.requesterId === +targetUserId) {
    return RECEIVER;
  }

  return REQUESTER;
};
