const controllers = require('../controllers');
const express = require('express');
const { userAuthenticated } = require('../middleware/auth');
const router = express.Router();

router.get("/", userAuthenticated, async (req, res) => {
  try {
    return res.status(200).json(await controllers.getMessages());
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
});

router.post("/create", userAuthenticated, async (req, res) => {
  try {
    const { sender_id, receiver_id, content } = req.body
    console.log("reqbody: ",req.body)
    //const { user_id, content } = req.body;
    return res.status(200).json(await controllers.postMessage( sender_id, receiver_id, content));
  } catch (error) {
    console.log (error)
    return res.status(500).json({message: error.message});
  }
});

router.delete("/:id", userAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    return res.status(200).json(await controllers.deleteMessage(id));
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
});

module.exports = router;