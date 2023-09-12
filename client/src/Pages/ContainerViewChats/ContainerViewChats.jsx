import React, { useEffect, useRef, useState } from 'react'
import Messages from '../../components/Messages/Messages'
import enviarIcon from '../../assets/enviar.png';
import adjuntarIcon from '../../assets/adjuntar.png';
import { useDispatch, useSelector } from 'react-redux';
import { postMessage, selectError, selectIsMinimized, selectSelectedUser, setIsMinimized, setListChats, setSelectedUser } from '../../redux/appSlice';
import { setAllUsers, setUser } from '../../redux/usersSlice';
import style from './ContainerViewChats.module.css'

const apiUrl = import.meta.env.VITE_URL_API;

const ContainerViewChats = ({ socket }) => {

// *================== ESTADOS LOCALES ======================
  const [messageChat, setMessageChat] = useState('');
  const [messageInfo, setMessageInfo] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] =useState('');
  const [preview, setPreview] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flag, setFlag] = useState(false);

// *================  ESTADOD GLOBALES =====================
  const selectedUser = useSelector(selectSelectedUser)
  const user = useSelector(state => state.users);
  const error = useSelector(selectError)
  const isMinimized = useSelector(selectIsMinimized);

  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  // Capturar el mensaje
  const handleChange = (event) => {
    const { value } = event.target;
    setMessageChat(value);
  };
  // Función para evitar ejectuar formulario al dar enter
  const handleKeyDow = (event) => {
    if(event.key === 'Enter'){
      event.preventDefault();
      messageChat.trim() !== '' && messagePrivateFile(event);
    }
  };
  // Función para cancelar el envio del archivo adjunto
  const handleCancelUpload = () => {
    setSelectedFile(null);
    setFilePreview('');
    setPreview(false);
    fileInputRef.current && (fileInputRef.current.value='');
  };
  // Enviar el archivo al estado local
  const handleFilechange = (event) => {
    const file = event.target.files[0];
    if(file){
      //console.log('file: ', file);
      setSelectedFile(file);
      setPreview(true);
      // Crear una URL local temporal para la vista previa del archivo
      setFilePreview(URL.createObjectURL(file));
      //window.open(URL.createObjectURL(file))
    }
  };
  // Función para cambiar el estado de isMinimized
  const toggleMinimize = (event) => {
    event.preventDefault();
    isMinimized === true ? dispatch(setIsMinimized(false)) : dispatch(setIsMinimized(true));
  };
  // Función para salir del Chat
  const exitChat = (event) => {
    event.preventDefault();
    window.localStorage.removeItem('loggedChatUser')
    dispatch(setUser({
      user_id:"",
      userName:"",
      image:"",
      token:"",
      access:false,
    }))
    dispatch(setAllUsers([]));
    dispatch(setSelectedUser({}));
    dispatch(setListChats([]));
  };

  const messagePrivateFile = (event) => {
    event.preventDefault();
    if(Object.keys(selectedUser).length === 0) {
      setMessageInfo('Selecciona un usuario para enviar mensaje')
      openModal()
      return
    }
    setFlag(true)
    const sender_id = user.user_id;
    const receiver_id = selectedUser?.UserReceived?.user_id === user.user_id
      ? selectedUser.UserSent?.user_id : selectedUser?.UserSent?.user_id === user.user_id
      ? selectedUser?.UserReceived?.user_id : selectedUser?.user_id !== user.user_id && selectedUser?.user_id;
    const content = messageChat;
    try {
      const formData = new FormData();
      formData.append('sender_id', sender_id)
      formData.append('receiver_id', receiver_id)
      formData.append('content', content)
      formData.append('file', selectedFile )
      dispatch(postMessage({formData, token: user.token})).then(response =>{
        socket.emit("private-message", {sender_id, receiver_id, scroll:true});
      })
      setMessageChat("");
      setSelectedFile(null);
      setPreview(false);
    } catch (error) {
      setMessageInfo(error.message)
      openModal()
    }
  };
  // manejo de estado para enviar mensaje en tiempo real
  useEffect(() => {
    if(flag){
      const sender_id = user.user_id;
      const receiver_id = selectedUser?.UserReceived?.user_id === user.user_id
        ? selectedUser.UserSent?.user_id : selectedUser?.UserSent?.user_id === user.user_id
        ? selectedUser?.UserReceived?.user_id : selectedUser?.user_id !== user.user_id && selectedUser?.user_id;
      socket.emit("private-message", {sender_id, receiver_id, scroll:true});
      setFlag(false)
    }
  }, [flag])

  // Abri y cerrar ventana modal
  const openModal = () => { setIsModalOpen(true) };
  const closeModal = () => {
    if(error === "jwt expired"){
      window.localStorage.removeItem('loggedChatUser')
      dispatch(setUser({
        user_id:"",
        userName:"",
        image:"",
        token:"",
        access:false,
      }))
      dispatch(setError(""))
    }
    setIsModalOpen(false)
    setMessageInfo('');
  };

  return (
    <div className={`${style.container} h-[calc(100vh-70px)] relative  border-[1px] border-slate-500 `}>
    {/* ENCABEZADO DERECHO (foto y nombre del Chat actual, ya se grupal o individual) */}
    <div className='flex justify-between items-center pr-[15px] gap-1 bg-slate-500 w-[100%] h-[60px] '>
      <div className='flex items-center  ml-[5px] gap-3'>
        <div className='flex w-[50px] h-[50px] rounded-full bg-gray-500'>
          {/* Foto del grupo o usuario al que se le envia mensajes */}
          <img className='w-full h-full object-cover rounded-full'
            src={(selectedUser?.UserReceived?.userName === user.userName)
              ? `${apiUrl}/${selectedUser?.UserSent?.image}`
              : `${apiUrl}/${selectedUser?.UserReceived?.image}` } alt='foto de perfil'
          />
        </div>
        <h2 className='my-2 font-bold text-[25px]'>
          {selectedUser?.UserReceived?.userName === user.userName
            ? selectedUser?.UserSent?.userName
            : selectedUser?.UserReceived?.userName}</h2>
      </div>
      {/* BOTONES CHAT */}
      <div className='flex gap-3 p-2'>
        {/* minimizar chat*/}
        <button
          onClick={toggleMinimize}
          className='flex justify-center items-center border-l border-r h-5 w-5 bg-gray-300 border-blue-950 rounded-md'
        ><h1 className='text-lg'>-</h1></button>
        {/* cerrar chat*/}
        <button
          onClick={exitChat}
          className='flex justify-center items-center border-l border-r h-5 w-5 bg-gray-300 border-blue-950 rounded-md'
        ><h1 className='text-lg'>x</h1></button>
      </div>
    </div>
    {/* //*CONTENEDOR DEL CHAT */}
    <Messages
      socket={socket}
      messagePrivateFile={messagePrivateFile}
      handleCancelUpload={handleCancelUpload}
      selectedFile={selectedFile}
      filePreview={filePreview}
      preview={preview}
    />
    {/** //*CONTENEDOR DEL FORM, INPUT PARA TIPEAR MENSAJE */}
    <form onSubmit={messagePrivateFile}>
      <div className={`flex w-[70%] justify-between h-[60px] p-2 bg-gray-500 fixed bottom-[4px] ${preview && "hidden"}`}>
        { // Validación
          !selectedFile &&
          (
            <label className='custom-file-upload flex justify-center mr-[4px]  items-center px-[4px] py-[2px] bg-blue-500 text-white rounded md cursor-pointer'>
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
          )
        }
        <input
          type="text"
          onChange={handleChange}
          onKeyDown={handleKeyDow}
          autoComplete='off'
          placeholder='write your message' name='messageChat' value={messageChat}
          className='border-2 border-zinc-500 p-2 w-full text-black rounded-lg'
        />
        {/* ENVIAR */}
        <button
          type='submit'
          className='bg-green-500 px-[8px] py-[9px] rounded-[50%] mx-2 hover:scale-110 flex justify-center items-center'
        >
          <img src={enviarIcon} className='w-[40px] h-[40px] mr-[6px]' />
        </button>
      </div>
    </form>
    {
      isModalOpen && (
        <div className='flex h-full w-full fixed border-2 bg-zinc-900/90 inset-y-0 inset-x-0 items-center justify-center'>
          <div className='bg-white flex flex-col border-2 justify-center items-center p-20 w-auto h-28 rounded-lg'>
              <h1 className='text-blue-950 my-2'>{messageInfo}</h1>
          <button onClick={closeModal} className='rounded-lg my-2 p-3 text-blue-100 bg-blue-600 w-min ' >Cerrar</button>
          </div>
        </div>
      )
    }

  </div>
  )
}

export default ContainerViewChats