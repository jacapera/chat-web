const bcrypt = require('bcryptjs');
const fs = require('fs');

async function hashPassword(password){
  const passwordHashed = await bcrypt.hash(password, 8);
  return passwordHashed;
}

function getFilePath(file){
  const path = file.path.split('\\');
  const fileName = path.pop();
  const folder = path.pop();
  return `${folder}/${fileName}`;
}

function unlinkFile(path){
  try {
    if(!path) throw new Error('No hay imagen a eliminar');
    fs.unlinkSync(`src/uploads/${path}`);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  hashPassword,
  getFilePath,
  unlinkFile,
}