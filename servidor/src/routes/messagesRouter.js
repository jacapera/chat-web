const controllers = require('../controllers');
const express = require('express');
const { userAuthenticated } = require('../middleware/auth');
const router = express.Router();

const uploadFile = require('../helpers/uploadFile.js');
const { getFilePath, unlinkFile } = require('../helpers/auth');
const uploadFileUser = uploadFile("src/uploads/files")

router.get("/", userAuthenticated, async (req, res) => {
  try {
    return res.status(200).json(await controllers.getMessages());
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
});

router.post("/create",  userAuthenticated, uploadFileUser.single("file"), async (req, res) => {
  try {
    req.body.file = '';
    if(req.file){
      req.body.file = getFilePath(req.file)
    }
    return res.status(200).json(await controllers.postMessage( req.body));
  } catch (error) {
    //console.log (error)
    unlinkFile(req.body.file)
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