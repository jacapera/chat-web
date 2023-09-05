const controllers = require('../controllers');
const multiparty = require('connect-multiparty');
const express = require('express');
const { getFilePath, unlinkFile } = require('../helpers/auth');
const { userAuthenticated } = require('../middleware/auth');
const router = express.Router();

const mdUserImg = multiparty({uploadDir: 'src/uploads/users'});
const uploadImageUser = require('../helpers/uploadImageUser.js')
const uploadImage = uploadImageUser("src/uploads/users");


router.get('/', userAuthenticated, async (req, res) => {
  try {
    return res.status(200).json(await controllers.getUsers());
  } catch (error) {
    return res.status(500).json({ message: error.messsage });
  }
});

router.get('/:user_id', userAuthenticated, async (req, res) => {
  try {
    const { user_id } = req.params;
    res.status(200).json(await controllers.getUserById(user_id));
  } catch (error) {
    return error.statusCode
      ? res.status(error.statusCode).json({message:error.message})
      : res.status(500).json({message:error.message});
  }
});

router.post('/create', uploadImage.single("image"), async (req, res) => {
  try {
    //console.log("body", req.body)
    //console.log("file", req.file)
    req.body.image = '';
    if(req.file){
      req.body.image = getFilePath(req.file)
    }
    return res.status(201).json(await controllers.postUser(req.body));
  } catch (error) {
    //console.log(error)
    if(error){
      unlinkFile(req.body.image)
    }
    if(error.statusCode){
      unlinkFile(req.body.image)
      return res.status(error.statusCode).json({message:error.message})
    }else{
      unlinkFile(req.body.image)
      return res.status(500).json({message:error});
    }
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    return res.status(200).json(await controllers.loginUser(email, password));
  } catch (error) {
    return error.statusCode
      ? res.status(error.statusCode).json({message:error.message})
      : res.status(500).json({message:error.message});
  }
});

router.put('/update/:user_id', userAuthenticated, async (req, res) => {
  try {
    const { user_id } = req.params;
    console.log(user_id)
    console.log(req.body)
    return res.status(200).json(await controllers.updateUser(user_id, req.body));
  } catch (error) {
    console.log(error)
    return res.status(500).json({message: error.message});
  }
});



module.exports = router;