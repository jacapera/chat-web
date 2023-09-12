import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import style from './Message.module.css'
import FilePreviewMessage from '../FilePreviewMessage/FilePreviewMessage'
import { deleteMessage, listChatsByUser, setListChats, setSelectedUser } from '../../redux/appSlice'

const Message = ({message_id, sender_id, receiver_id, createdAt, content, file, filePreview, socket}) => {

  const [flag, setFlag] = useState(false)

// *================  ESTADOD GLOBALES =====================
  const user = useSelector(state => state.users);

  const dispatch = useDispatch();

  // Formatear fecha
  const formatDate = (date) => {
    // Obtener el nombre del día de la semana
    const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const nombreDiaSemana = diasSemana[date.getDay()];
    // Obtener la hora y los minutos
    const hora = date.getHours();
    let minutos = date.getMinutes();
    minutos < 10 ? minutos=`0${minutos}`: minutos;
    // Concatenar fecha
    return `${nombreDiaSemana} ${hora}:${minutos}`;
  };

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    if(selectedValue === "eliminar"){
      handleDeleteMessage()
      event.target.value=""
    }
  }

  const handleDeleteMessage = () => {
    setFlag(true)
    dispatch(deleteMessage({message_id, token: user.token}))
      // .then(response => {
      //   socket.emit("private-message", {sender_id, receiver_id});
      // }).catch(error => console.log("ERROR ", error))
  }

  useEffect(() => {
    if(flag){
      socket.emit("private-message", {sender_id, receiver_id, scroll:false});
      setFlag(false)
    }
  }, [flag])

  return (
    <div
      className={` my-[2px] mx-[10px] p-[15px] text-sm w-fit max-w-[60%] rounded-lg
      ${sender_id === user.user_id ? "bg-blue-200 text-blue-900 ml-auto rounded-tr-[0%]" : "bg-blue-900 mr-[auto] text-blue-100 ml-[25px] rounded-tl-[0%]"}`}
    >
      {/* <span
        className='text-[18px] font-bold text-slate-300 flex relative right-[40px]'
      >{item.User.userName}</span> */}
      <div className='flex justify-between '>
        <span
          className={`text-sm `}
        >{formatDate(new Date(createdAt))}</span>
        {
          sender_id === user.user_id &&
            <select  onChange={handleOptionChange} className={ `bg-blue-200 w-[15px]`}>
              <option value="default" hidden></option>
              <option value={"eliminar"} >Eliminar</option>
            </select>
        }

      </div>
      {
        (file !== "" && file !== null) && <FilePreviewMessage file={file} filePreview={filePreview} />
      }

      <span className='ml-[5px] text-md  flex text-left'>{content}</span>

    </div>
  )
}

export default Message