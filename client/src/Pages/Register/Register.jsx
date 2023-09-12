import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import validation from './validation';
import axios from 'axios';
import adjuntarIcon from '../../assets/adjuntar.png';
import styleRegister from './styleRegister.css'
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';

const Register = () => {
  // Estados Locales
  // -------------------------------------------------------
  const [formRegister, setFormRegister] = useState({
    email:"",
    userName:"",
    password:"",
    image:{},
  });
  const [formValid, setFormValid] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Variables
  // ---------------------------------------------------------
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = event => {
    const { value, name } = event.target;
    setFormRegister({
      ...formRegister,
      [name]: value
    });
    setFormErrors(validation({
      ...formRegister,
      [name]: value
    }))
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouchedFields(prevTouchedFields => ({
      ...prevTouchedFields,
      [name]: true,
    }));
  };

  // Función para evitar ejectuar formulario al dar enter
  const handleKeyDow = (event) => {
    if(event.key === 'Enter'){
      event.preventDefault();
      message.trim() !== ''&& handleSubmit(event);
    }
  };

  const handleTogglePasswordVisibility = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  // Enviar el archivo al estado local
  const handleFilechange = (event) => {
    const file = event.target.files[0];
    if(file){
      //console.log('file: ', file);
      setFormRegister({
        ...formRegister,
        image: file
      });
      //setPreview(true);
      // Crear una URL local temporal para la vista previa del archivo
      //setFilePreview(URL.createObjectURL(file));
      //window.open(URL.createObjectURL(file))
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let auxErrors = Object.values(formErrors).every(value => value === "");
    if(auxErrors){
      try {
        const formData = new FormData();
        formData.append('full_name', formRegister.full_name);
        formData.append('email', formRegister.email);
        formData.append('userName', formRegister.userName);
        formData.append('password', formRegister.password);
        formData.append('image', formRegister.image);

        const response = await submitForm(formData);
        console.log("response -> ", response)
        setMessage(response);
        openModal();
        setFormErrors({});
        setFormRegister({
          full_name:"",
          email:"",
          userName:"",
          password:"",
        });
      } catch (error) {
        setMessage(error.message);
        openModal();
      }
    }
  };

  const submitForm = async (formData) => {
    try {
      const response = await axios.post('http://localhost:3007/api/v1/users/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };



  const openModal = () => { setIsModalOpen(true) };
  const closeModal = () => {
    setIsModalOpen(false)
    message === "Usuario registrado con éxito" && navigate('/login');
    setMessage('');
  };

  useEffect(() => {
    console.log("Form: " , formRegister);
    const errors = validation(formRegister);
    //console.log("TOUCH: ", touchedFields)

    if(Object.keys(touchedFields).length  > 0){
      setFormErrors({
        "full_name": errors.full_name || "",
        "userName": errors.userName || "",
        "email": errors.email || "",
        "password": errors.password || "",
      });
    }
    //console.log("FORMERROR: " , formErrors);
    if(Object.keys(errors).length === 0) setFormValid(true);
    else setFormValid(false);
  }, [formRegister, touchedFields]);

  return (
    <div className='flex w-[100%] h-[calc(100vh-80px)] overflow-auto justify-center fixed top-[80px] left-0  '>
      <div className='flex flex-col w-[400px] h-[fit-content] justify-center items-center border-2 border-blue-950 bg-blue-600 shadow-2xl p-[30px] rounded-md mt-[20px] '>
        <h1 className='text-[aqua] text-xl mb-[5px]  '>Sign Up</h1>
        <form  onSubmit={handleSubmit}
          className='flex flex-col border-2 p-[20px] rounded-md w-full h-[fit-content] justify-center itme'
        >
          <div className='flex flex-col shadow-white ' >
              <label className='mt-[8px]' >Nombre Completo</label>
              <input
                className='rounded-md h-[40px] p-[5px] shadow-white  '
                onChange={handleChange}
                onBlur={handleBlur}
                value={formRegister.full_name}
                autoComplete='off'
                name='full_name' type="text" placeholder='escriba email aquí'
              />
          </div>
          {touchedFields.full_name && formErrors.full_name && <p className='text-red-600' >{formErrors.full_name}</p>}
          <div className='flex flex-col shadow-white ' >
              <label className='mt-[8px]' >Email</label>
              <input
                className='rounded-md h-[40px] p-[5px] shadow-white  '
                onChange={handleChange}
                onBlur={handleBlur}
                value={formRegister.email}
                autoComplete='off'
                name='email' type="text" placeholder='escriba email aquí'
              />
          </div>
          {touchedFields.email && formErrors.email && <p className='text-red-600' >{formErrors.email}</p>}
          <div className='flex flex-col' >
              <label className='mt-[8px]' >Username</label>
              <input
                className='rounded-md h-[40px] p-[5px]  '
                onChange={handleChange}
                onBlur={handleBlur}
                value={formRegister.userName}
                autoComplete='off'
                name='userName' type="text" placeholder='escriba username aquí'
              />
          </div>
          {touchedFields.userName && formErrors.userName && <p className='text-red-600' >{formErrors.userName}</p>}
          {/* ADJUNTAR IMAGEN */}
          <div className='flex flex-col m-[10px]'>
            <label>Adjuntar una imagen</label>
            <div>
              <label className='custom-file-upload flex justify-center mr-[4px] w-[45px] h-[50px] items-center px-[4px] py-[2px] bg-blue-500 text-white rounded md cursor-pointer'>
                <input
                  className='hidden'
                  onKeyDown={handleKeyDow}
                  ref={fileInputRef}
                  type='file' onChange={handleFilechange}
                />
                <img src={adjuntarIcon} alt="adjuntar archivo"
                  className='w-[30px] h-[60px] object-cover'
                />
              </label>
              <div className='container flex h-[30px] w-[100%] overflow-x-auto custom-scrollbar-horizontal'>
                <label className='flex w-[100%] label-img text-xs text-blue-950'>{formRegister.image?.name}</label>
              </div>
            </div>
          </div>
          {/* INPUT PASSWORD */}
          <div className='flex flex-col'>
              <label className='mt-[8px]' >Password</label>
              <input
                className='rounded-md h-[40px] p-[5px]  '
                onChange={handleChange} value={formRegister.password}
                onBlur={handleBlur}
                name='password' type={showPassword ? "text" : "password"}
                autoComplete='off'
                placeholder='escriba password aquí'
              />
              <button onClick={handleTogglePasswordVisibility}
                className='flex justify-center items-center w-[30px] h-[30px] bg-transparent relative top-[-35px] right-[-86%] '
              >{showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}</button>
          </div>
          {touchedFields.password && formErrors.password && <p className='text-red-600' >{formErrors.password}</p>}
          {/*//* BOTON DE ENVIAR */}
          <div className='flex justify-center'>
            <button
              className={`flex w-[fit-content] text-blue-400 p-[8px] rounded-lg mt-[10px]
                bg-blue-950 hover:bg-blue-500 hover:text-blue-950 transform hover:scale-105 transition duration-300 buttonRegister`}
              type='submit'  disabled={!formValid}
            >Registrarse</button>
          </div>
        </form>
        <div className='flex gap-[5px] justify-center items-center ' >
            <h3 className='text-sm'>¿Ya tienes cuenta?</h3>
            <Link className='text-xs text-blue-300' to={'/login'}>Sign in</Link>
        </div>
      </div>
      {
        isModalOpen && (
          <div className='flex h-full w-full fixed border-2 bg-zinc-900/90 inset-y-0 inset-x-0 items-center justify-center'>
              <div className='bg-white flex flex-col border-2 justify-center items-center p-20 w-auto h-28 rounded-lg'>
                  <h1 className='text-blue-950 my-2'>{message}</h1>
              <button onClick={closeModal} className='rounded-lg my-2 p-3 text-blue-100 bg-blue-600 w-min ' >Cerrar</button>
              </div>
          </div>
        )
      }
    </div>
  )
}

export default Register