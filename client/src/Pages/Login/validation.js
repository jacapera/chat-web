export default function validation(input){
  const error = [];

  const regexEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  //const regexPassword = new RegExp("[0-9]");
  const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  !input.email && (error.email = "Email es requerido");
  !regexEmail.test(input.email) && (error.email = "Debes ingresar un email valido");
  input.email.length > 35 && (error.email = "Email no puede ser mayor a 35 caracteres");

  !input.password && (error.password = "Password es requerido");
  !regexPassword.test(input.password) && (error.password = "Password debe tener al menos mínimo 8 caracteres, una minuscula, una mayuscula, un número y un caracter especial");
  //console.log('validation error: ', error);
  return error;

}