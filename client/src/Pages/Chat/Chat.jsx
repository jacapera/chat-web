import React,  { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import { useLocation, useNavigate } from 'react-router-dom';
import adjuntarIcon from '../../assets/adjuntar.png';
import enviarIcon from '../../assets/enviar.png';
import Messages from '../../components/Messages/Messages'
//import scrollbar from './scrollbar.css?inline';
import scrollbar from './scrollbar.css';
import {
  listChatsByUser,
  postMessage,
  selectActiveChatMessages, selectIsMinimized, selectMessages, selectSelectedUser,
  setActiveChatMessages, setIsMinimized, setListChats, setMessages, setSelectedUser
} from '../../redux/appSlice';
// import FileViewer from 'react-file-viewer';
import Login from '../Login/Login';
import ListUsers from './ListUsers';
import { selectAllUsers, setAllUsers, setUser } from '../../redux/usersSlice';
import { PlaylistAddCircleRounded, Settings } from '@mui/icons-material';
import ListChat from './ListChat';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_URL_API;

//const socket = io('http://localhost:3007');

const Chat = () => {
  // *================== ESTADOS LOCALES ======================
  const [messageInfo, setMessageInfo] = useState('');
  const [messageChat, setMessageChat] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] =useState('');
  const [preview, setPreview] = useState(false);
  const [socket, setSocket] = useState(null);
  //const [messagesSelected, setMessagesSelected] = useState([]);
  //const [lastConected, setLastConected] = useState({});
  //const [chats, setChats] = useState([]);
  //console.log("socket: ", socket?.id)

  // *================  ESTADOD GLOBALES =====================
  const userName = useSelector(state => state.users.userName);
  const user = useSelector(state => state.users);
  const image = useSelector(state => state.users.image);
  const isMinimized = useSelector(selectIsMinimized);
  const access = useSelector(state => state.users.access);
  const allUsers = useSelector(selectAllUsers)
  const messages = useSelector(selectMessages);
  const activeChatMessages = useSelector(selectActiveChatMessages);
  const selectedUser = useSelector(selectSelectedUser)
  const listChats = useSelector(state => state.app.listChats);

  // *======= VARIABLES =============
  const messagesRef = useRef(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // *============== HANDLERS ===============================
  // Capturar el mensaje
  const handleChange = (event) => {
    const { value } = event.target;
    setMessageChat(value);
  };
  // Función para evitar ejectuar formulario al dar enter
  const handleKeyDow = (event) => {
    if(event.key === 'Enter'){
      event.preventDefault();
      messageChat.trim() !== '' && messagePrivate(event);
    }
  };
  // Seleccionar un usuario
  const handleUserSelection = (user) => {
    dispatch(setSelectedUser(user));
    console.log('selectedUser: ',selectedUser);
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

  const messagePrivateFile = (event) => {
    event.preventDefault();
    if(Object.keys(selectedUser).length === 0) {
      setMessageInfo('Selecciona un usuario para enviar mensaje')
      openModal()
      return
    }
    const sender_id = user.user_id;
    const receiver_id = selectedUser?.UserReceived?.user_id === user.user_id
      ? selectedUser.UserSent?.user_id : selectedUser?.UserSent?.user_id === user.user_id
      ? selectedUser?.UserReceived?.user_id : selectedUser?.user_id !== user.user_id && selectedUser?.user_id;
    const content = messageChat;
    const userNameReceptor =
      selectedUser?.UserReceived?.userName === user.userName
      ? selectedUser?.UserSent?.userName : selectedUser?.UserSent?.userName === user.userName
      ? selectedUser?.UserReceived?.userName : selectedUser?.userName !== user.userName
      && selectedUser?.userName;
    const userNameEmisor = user.userName;
    try {
      const formData = new FormData();
      formData.append('sender_id', sender_id)
      formData.append('receiver_id', receiver_id)
      formData.append('content', content)
      formData.append('file', selectedFile )
      dispatch(postMessage({formData, token: user.token}))
      socket.emit("private-message",
      {
        sender_id, receiver_id, userNameReceptor, userNameEmisor
      });
      setMessageChat("");
      setSelectedFile(null);
      setPreview(false);
    } catch (error) {
      setMessageInfo(error.message)
      openModal()
    }
  };


  // const messagePrivate = (event) => {
  //   event.preventDefault();
  //   if(Object.keys(selectedUser).length === 0) {
  //     setMessageInfo('Selecciona un usuario para enviar mensaje')
  //     openModal()
  //     return
  //   }
  //   if(messageChat !== '' ){
  //     //const fecha = formatDate(new Date());
  //     const sender_id = user.user_id;

  //     const receiver_id = selectedUser?.UserReceived?.user_id === user.user_id
  //       ? selectedUser.UserSent?.user_id : selectedUser?.UserSent?.user_id === user.user_id
  //       ? selectedUser?.UserReceived?.user_id : selectedUser?.user_id !== user.user_id && selectedUser?.user_id;

  //     const content = messageChat;
  //     const userNameReceptor =
  //       selectedUser?.UserReceived?.userName === user.userName
  //       ? selectedUser?.UserSent?.userName : selectedUser?.UserSent?.userName === user.userName
  //       ? selectedUser?.UserReceived?.userName : selectedUser?.userName !== user.userName
  //       && selectedUser?.userName;
  //     const userNameEmisor = userName;
  //     const formData = {
  //       sender_id,
  //       receiver_id,
  //       content
  //     }
  //     dispatch(postMessage({formData, token:user.token}))
  //     socket?.emit("private-message",
  //       {
  //         sender_id, receiver_id, userNameReceptor, userNameEmisor
  //       });
  //     setMessageChat("");
  //     setPreview(false);
  //   }
  // };

  // Guardar todos los mensajes para renderizar
  const receiveMessage = data => {
    dispatch(listChatsByUser({user_id:user.user_id, token: user.token}))
    .then(({payload}) => {
      dispatch(setListChats(payload))
      dispatch(setSelectedUser(payload[0]))
    }).catch(error => {
      console.log("PAYLOAD: ", error)
    })
  }

  // Abri y cerrar ventana modal
  const openModal = () => { setIsModalOpen(true) };
  const closeModal = () => {
    setIsModalOpen(false)
    setMessageInfo('');
  };
  // Escuchando evento para recibir mensaje en tiempo real
  useEffect(() => {
    socket?.on("mensaje-recibido", receiveMessage)
    return () => {socket?.off("mensaje-recibido", receiveMessage)};
  }, [socket, listChats, user, receiveMessage,]);

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
    dispatch(setMessages([]));
    dispatch(setAllUsers([]));
    dispatch(setSelectedUser({}));
    dispatch(setListChats([]));
  };

  //Conexión de Socket al servidor
  useEffect(() => {
    const newSocket = io(apiUrl);
    newSocket.on("connect", () => {
      setSocket(newSocket)});
    return () => {
      socket && newSocket.disconnect();
    };
  },[]);

  // Envia username para agregar usuario conectados al servidor
  useEffect(() => {
    socket?.emit("newUser", userName);
  },[socket, userName]);

  useEffect(() => {
    if(Object.keys(selectedUser).length === 0){
      listChats.length > 0 && dispatch(setSelectedUser(listChats[0]))
    }
  }, []);

  return (
    <div className={`flex w-[100%] border-2 ${!access && "hidden"}`}>
      {
        !isMinimized ? (
          // *================================================
          // *CONTENEDOR PRINCIPAL EN PAGINA COMPLETA DEL CHAT
          // *================================================
          <div className='container-chat w-[100%] h-[100%] flex items-center justify-start border-2'>
            {/* //*CONTENEDOR PRINCIPAL PANEL IZQUIERDO */}
            <div className='flex flex-col bg-white border-2 border-slate-400 w-[30%] h-full '>
              {/* ENCABEZADO IZQUIERDO (mi foto y username)*/}
              <div className='flex items-center left-[4px] top-[70] gap-3 bg-slate-400 w-[29.3%] h-[60px] fixed'>
                <div className='flex w-[50px] h-[50px] ml-[5px] rounded-full bg-gray-500'>
                  <img className='w-full h-full object-cover rounded-full' src={`${apiUrl}/${image}`} alt='imagen de perfil' />
                </div>
                <h1 className='my-2 text-[25px]'>{userName}</h1>
              </div>
              <div>
                <ListUsers onUserSelect={handleUserSelection} socket={socket} messages={messages} />
              </div>
              <div>
                <ListChat onUserSelect={handleUserSelection} socket={socket} />
              </div>
            </div>

            {/* //* CONTENEDOR PRINCIPAL PANEL DERECHO */}
            <div className='flex flex-col w-[70%] h-[calc(100vh-70px)] relative bottom-[36px] pb-[0px] border-2 border-slate-500 bg-white'>
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
              {/** //*-------------------------------------------- */}
              <form onSubmit={messagePrivateFile}>
                <div className={`flex w-[69%] justify-between h-[60px] mt-[10px] p-2 bg-gray-500 fixed bottom-0 ${preview && "hidden"}`}>
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

            </div>
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
        ) :
        (
          // *================================================
          // *             CHAT MINIMIZADO
          // *================================================
          <div className='flex justify-around  fixed items-center border-2 bg-white border-blue-950 rounded-md bottom-10 right-10 w-32 h-10'>
            <span className='font-bold'>Chat</span>
            <button
              onClick={toggleMinimize}
              className='flex justify-center items-center border-2 h-5 w-5 border-blue-950 cursor-pointer'
            ></button>
          </div>
        )
      }
    </div>
  )
}

export default Chat