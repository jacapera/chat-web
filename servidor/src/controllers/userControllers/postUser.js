const { User } = require('../../db');
const { hashPassword, unlinkFile } = require('../../helpers/auth');

const postUser =  async (user) => {
  const { userName, email, image, full_name, rol } = user;
  let { password } = user;

  if (!userName || !password || !email || !full_name  ) { // || !rol
    const error = new Error('Falta información');
    error.statusCode = 400;
    throw error;
  }
  password = await hashPassword(password);
  /**
   * *findOrCreate: buscará un registro en la base de datos
   * que coincida con las condiciones proporcionadas o creará
   * un nuevo registro si no se encuentra ningún resultado.
   *
   * *created:será un valor booleano que indicará si el usuario
   * fue creado o simplemente encontrado en la base de datos
   * (es decir, true si fue creado, false si fue encontrado).
   */
  try {
    const [ userCreated, created ]  = await User.findOrCreate({
      where: { email },
      defaults: { email, password, userName, image, full_name, rol }
    });
    if(created){
      return 'Usuario registrado con éxito'
    } else {
      unlinkFile(image);
      return 'Usuario ya esta registrado'
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = postUser;