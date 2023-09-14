import React,  { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getOneChat,
  listChatsByUser,
  selectError, selectIsMinimized, selectSelectedUser,
  setError,
  setIsMinimized, setListChats, setScroll, setSelectedUser
} from '../../redux/appSlice';
// import FileViewer from 'react-file-viewer';
import { setUser } from '../../redux/usersSlice';
import { PlaylistAddCircleRounded, Settings } from '@mui/icons-material';
import ContainerLists from '../ContainerLists/ContainerLists';
import style from './Chat.module.css'
import ContainerViewChats from '../ContainerViewChats/ContainerViewChats';

const Chat = ({ socket }) => {

// *================== ESTADOS LOCALES ======================
  const [messageInfo, setMessageInfo] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // *================  ESTADOD GLOBALES =====================
  const user = useSelector(state => state.users);
  const isMinimized = useSelector(selectIsMinimized);
  const access = useSelector(state => state.users.access);
  const selectedUser = useSelector(selectSelectedUser)
  const listChats = useSelector(state => state.app.listChats);
  const error = useSelector(selectError)

  // *======= VARIABLES =============
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  // Guardar todos los mensajes para renderizar
  const receiveMessage = async (data) => {
    //console.log("DATA", data)
    dispatch(setScroll(data.scroll))
    const sender_id = user.user_id;
    const receiver_id = selectedUser?.UserReceived?.user_id === user.user_id
      ? selectedUser.UserSent?.user_id : selectedUser?.UserSent?.user_id === user.user_id
      ? selectedUser?.UserReceived?.user_id : selectedUser?.user_id !== user.user_id && selectedUser?.user_id;
    //console.log("receiver_id", receiver_id)
    const token = user.token;
    try {
      const res1 = await dispatch(listChatsByUser({user_id:user.user_id, token}))
      const res2 = await dispatch(getOneChat({sender_id, receiver_id, token}))
      //console.log(res2.payload)
      dispatch(setListChats(res1.payload))
      dispatch(setSelectedUser(res2.payload))
    } catch (error) {
      console.log("ERROR: ", error)
    }
  }

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
  // manejo para cuando se termine la sesion
  useEffect(() => {
    if(error === "jwt expired"){
      setMessageInfo(`${error}, inicie sesion de nuevo`)
      openModal()
    }
  },[error])
  // Escuchando evento para recibir mensaje en tiempo real
  useEffect(() => {
    socket?.on("mensaje-recibido", receiveMessage)
    return () => {socket?.off("mensaje-recibido", receiveMessage)};
  }, [socket, selectedUser]);

  // Función para cambiar el estado de isMinimized
  const toggleMinimize = (event) => {
    event.preventDefault();
    isMinimized === true ? dispatch(setIsMinimized(false)) : dispatch(setIsMinimized(true));
  };

  // Envia username para agregar usuario conectados al servidor
  useEffect(() => {
    socket?.emit("newUser", user.user_id);
  },[socket, user]);

  // al cargar la aplicacion o recargar la pagina se selecciona ultimo chat
  useEffect(() => {
    if(Object.keys(selectedUser).length === 0){
      listChats.length > 0 && dispatch(setSelectedUser(listChats[0]))
    }
  }, [listChats]);

  return (
    <div className={`${style.container} ${!access && "hidden"}`}>
      {
        !isMinimized ? (
          <div className={`${style.containerChat}`}>
            <ContainerLists socket={socket} />
            <ContainerViewChats socket={socket} />
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