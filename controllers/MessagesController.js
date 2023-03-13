import MessageModel from "../models/message.js";

export const getAll = async (req, res) => {
  try {
    let page = req.query.page;
    const limit = 15;

    const newMessages = await MessageModel.find().sort({ createdAt: -1 });

    const pageLimit = Math.ceil(newMessages.length / limit);
    if (page <= 0) {
      page = 1;
    }
    if (pageLimit < page) {
      page = pageLimit;
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const newSortedMessages = newMessages.slice(startIndex, endIndex);

    res.json(newSortedMessages);
  } catch (error) {
    res.status(500).json({
      message: "Cannot load message, verify connection",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const messageId = req.params.id;

    MessageModel.findOneAndUpdate(
      {
        _id: messageId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      },
      (err, doc) => {
        if (err) {
          return res.status(500).json({
            message: "Cannot return data of your message",
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: "Cannot find your message",
          });
        }
        res.json(doc);
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "Cannot load message, verify connection",
    });
  }
};
export const remove = async (req, res) => {
  try {
    const messageId = req.params.id;

    MessageModel.findOneAndDelete(
      {
        _id: messageId,
      },
      (err, doc) => {
        if (err) {
          return res.status(500).json({
            message: "Cannot delete your message",
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: "Cannot find your message",
          });
        }
        res.json({
          succes: true,
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "Cannot delete message, verify connection",
    });
  }
};
export const update = async (req, res) => {
  try {
    const messageId = req.params.id;

    await PostModel.updateOne(
      {
        _id: messageId,
      },
      {
        text: req.body.text,
        viewsCount: req.body.viewsCount,
        emodji: req.body.emodji,
        user: req.userId,
      }
    );
    res.json({
      succes: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Cannot  update message, verify data",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new MessageModel({
      text: req.body.text,
      viewsCount: req.body.viewsCount,
      emodji: req.body.emodji,
      user: req.userId,
      nickname: req.body.nickname,
      gender: req.body.gender,
      avatarUrl: req.body.avatarUrl,
    });

    const message = await doc.save();

    res.json(message);
  } catch (error) {
    res.status(500).json({
      message: "Cannot send message, verify data",
    });
  }
};
export const updateAvatars = async (req, res) => {
  try {
    const messages = await MessageModel.updateMany(
      { user: req.userId },
      { $set: { avatarUrl: req.body.url } }
    ).exec();
    // const newMessages = await MessageModel.find();
    res.json(messages);
  } catch (error) {
    res.status(500).json({
      message: "Cannot update messages, verify connection",
    });
  }
};
