const controllers = require('../controllers');
const express = require('express');
const { userAuthenticated } = require('../middleware/auth');
const router = express.Router();

router.get("/:user_id", userAuthenticated, async (req, res) => {
  try {
    const { user_id } = req.params;
    return res.status(200).json(await controllers.getChatsByUser(user_id));
  } catch (error) {
    return res.status(500).json({message:error.message});
  }
});

router.get("/:sender_id/:receiver_id", userAuthenticated, async (req, res) => {
  try {
    const { sender_id, receiver_id } = req.params;
    return res.status(200).json(await controllers.getChatOne(sender_id, receiver_id));
  } catch (error) {
    return error.statusCode
    ? res.status(error.statusCode).json({message:error.message})
    : res.status(500).json({message:error.message});
  }
});

router.get("/", userAuthenticated, async (req, res) => {
  try {
    return res.status(200).json(await controllers.getChats());
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:error.message});
  }
});




module.exports = router;