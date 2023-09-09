import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import style from './Message.module.css'
import FilePreviewMessage from '../FilePreviewMessage/FilePreviewMessage'
import { deleteMessage, listChatsByUser, setListChats, setSelectedUser } from '../../redux/appSlice'

const Message = ({message_id, sender_id, createdAt, content, file, filePreview}) => {

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
    }
  }

  const handleDeleteMessage = () => {
    dispatch(deleteMessage({message_id, token: user.token}))
      .then(response => {
        console.log("DELETEMESSAGE", response)
        dispatch(listChatsByUser({user_id: user.user_id, token: user.token}))
          .then( response => {
            console.log("Actualizando", response)
            dispatch(setListChats(response.payload))
          })
      }).catch(error => {
        console.log("ERROR: ", error)
      })
  }

  return (
    <div
      className={` my-[2px] mx-[10px] p-[15px] text-sm w-fit max-w-[60%] rounded-lg
      ${sender_id === user.user_id ? "bg-blue-200 text-blue-900 ml-auto rounded-tr-[0%]" : "bg-blue-900 mr-[auto] text-blue-100 ml-[25px] rounded-tl-[0%]"}`}
    >
      {/* <span
        className='text-[18px] font-bold text-slate-300 flex relative right-[40px]'
      >{item.User.userName}</span> */}
      <div className='flex '>
        <span
          className={`text-sm `}
        >{formatDate(new Date(createdAt))}</span>
        {
          sender_id === user.user_id &&
            <select defaultValue="default" onChange={handleOptionChange} className={ `bg-blue-200 w-[15px]`}>
              <option value="default" hidden></option>
              <option value="eliminar" >Eliminar</option>
            </select>
        }

      </div>
      {
        file && <FilePreviewMessage file={file} filePreview={filePreview} />
      }

      <span className='ml-[5px] text-md  flex text-left'>{content}</span>

    </div>
  )
}

export default Message