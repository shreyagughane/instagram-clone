const router = require("express").Router();
const Message = require("../models/Message");

// send message
router.post("/", async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    const savedMessage = await newMessage.save();

    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get messages
router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId
    });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;