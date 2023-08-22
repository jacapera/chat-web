export default function validation(input){
  const error = [];

  const regexEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  //const regexPassword = new RegExp("[0-9]");
  const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const regexName = /^[a-zA-Z0-9\s]+$/i
  const regexUserName = /^\S+$/;

  !input.full_name ? error.full_name = "El nombre es requerido"
  : (input.full_name.length < 5 || input.full_name.length > 30) ? error.full_name = "El nombre de tener mínimo 5 y máximo 30 caracters"
  : (!regexName.test(input.full_name)) && (error.full_name = "El nombre no puede tener caracteres especiales");

  !input.userName && (error.userName = "Username es requerido");
  !regexUserName.test(input.userName) && (error.userName = "Username no debe tener espacios ni al comienzo, final o en medio");

  !input.email && (error.email = "Email es requerido");
  !regexEmail.test(input.email) && (error.email = "Debes ingresar un email valido");
  input.email.length > 35 && (error.email = "Email no puede ser mayor a 35 caracteres");

  !input.password && (error.password = "Password es requerido");
  !regexPassword.test(input.password) && (error.password = "Password debe tener al menos mínimo 8 caracteres, una minuscula, una mayuscula, un número y un caracter especial");
  //console.log('validation error: ', error);
  return error;

}