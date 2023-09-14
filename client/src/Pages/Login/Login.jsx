import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../redux/usersSlice';
import { Link, useNavigate } from 'react-router-dom';
import validation from './validation';
import axios from 'axios';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import style from './Login.module.css';

const apiUrl = import.meta.env.VITE_URL_API;

const Login = () => {

  const [formRegister, setFormRegister] = useState({
    email:"",
    password:"",
  });
  const [formValid, setFormValid] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

  const handleTogglePasswordVisibility = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let auxErrors = Object.values(formErrors).every(value => value === "");
    if(auxErrors){
      await axios.post(`${apiUrl}/api/v1/users/login`, formRegister)
        .then(response => {
          //console.log(response)
          dispatch(setUser(response.data))
          window.localStorage.setItem(
            'loggedChatUser', JSON.stringify(response.data)
          )
          navigate('/chat')
        }).catch(error => {
          console.log(error)
          setMessage(error.response.data.message);
          openModal();
        })
    }
  };

  const openModal = () => { setIsModalOpen(true) };
  const closeModal = () => {
    setIsModalOpen(false)
    setMessage('');
  };

  // useEffect(() => {
  //   isLogin
  //     ? navigate('/chat')
  //     : navigate('/login')
  // }, [isLogin]);

  useEffect(() => {
    //console.log("Form: " , formRegister);
    const errors = validation(formRegister);
    //console.log("TOUCH: ", touchedFields)

    if(Object.keys(touchedFields).length  > 0){
      setFormErrors({
        "email": errors.email || "",
        "password": errors.password || "",
      });
    }
    //console.log("FORMERROR: " , formErrors);
    if(Object.keys(errors).length === 0) setFormValid(true);
    else setFormValid(false);
  }, [formRegister, touchedFields]);

  return (
    <div className='flex w-[100%] h-[calc(100vh-80px)] justify-center fixed top-[80px] left-0  '>
      <div className='flex flex-col w-[360px] h-[fit-content] justify-center items-center border-2 border-blue-950 bg-blue-600 shadow-2xl p-[30px] rounded-md mt-[20px] '>
        <h1 className='text-[aqua] text-xl mb-[5px]  '>Sign In</h1>
        <form  onSubmit={handleSubmit}
          className='flex flex-col border-2 p-[20px] rounded-md w-full h-[fit-content] justify-center itme'
        >
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
                bg-blue-950 hover:bg-blue-500 hover:text-blue-950 transform hover:scale-105 transition duration-300 ${style.buttonRegister}`}
              type='submit'  disabled={!formValid}
            >Entrar</button>
          </div>
        </form>
        <div className='flex gap-[5px] justify-center items-center ' >
            <h3 className='text-sm'>¿No tienes cuenta?</h3>
            <Link className='text-xs text-blue-300' to={'/register'}>Registrate</Link>
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

export default Login