const { User } = require('../../db');

const updateUser = async (user_id, changes) => {
  console.log('aqui:', user_id, changes)
  const { rol, email, userName, password, session, image } = changes;
  const [rowsUpdated, updatedUsers] = await User.update(changes,{
    where: { user_id },
    returning: true,
  })

  if (rowsUpdated > 0) {
    // La actualización fue exitosa
    const userUpdated = updatedUsers[0];
    delete userUpdated.dataValues.password;
    return { message: 'Usuario actualizado correctamente', user: userUpdated }
  } else {
    // No se encontró el usuario con el ID especificado
    return { message: 'Usuario no encontrado' }
  }
}

module.exports = updateUser;