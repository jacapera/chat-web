const multer = require('multer')
const path = require('path')

const uploadImageUser = (destino) => {
  const storage = multer.diskStorage({
    destination: function(req, file, cb){
      //console.log("file", file)
      cb(null, destino );
    },
    filename: function(req, file, cb){
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });

  const checkFileType = function (file, cb) {
    const fileTypes = /jpeg|jpg|png|gif|svg/;
    const extName = fileTypes.test(path.extname(file.originalname));
    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType && extName) {
      return cb(null, true);
    } else {
      cb("Error: You can Upload Images Only!!");
    }
  };

  const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 },
    fileFilter: (req, file, cb) => {
      checkFileType(file, cb);
    },
  });
  
  return upload;
}

module.exports = uploadImageUser;