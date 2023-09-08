const multer = require('multer')

const uploadFile = (destino) => {
  const storage = multer.diskStorage({
    destination: function(req, file, cb){
      //console.log("FILE: ", file)
      cb(null, destino)
    },
    filename: function(req, file, cb){
      cb(null, `${Date.now()}-${file.originalname}`)
    }
  });

  const upload = multer({
    storage: storage,
    limits: { filesize: 10000000}
  });
  //console.log("UPLOAD: ", upload)
  return upload;
}

module.exports = uploadFile