import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FilePreviewMessage from '../FilePreviewMessage/FilePreviewMessage'
import { deleteMessage, listChatsByUser, setListChats, setSelectedUser } from '../../redux/appSlice'
import style from './Message.module.css'
const apiUrl = import.meta.env.VITE_URL_API;

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

  const downloadFileFromURL = (event, fileURL) => {
    event.preventDefault();
    //console.log(fileURL)
    const link = document.createElement('a');
    link.href = fileURL;
    link.download = fileURL.split("/").pop();
    link.target = '_blank';
    link.click()
  }

  useEffect(() => {
    if(flag){
      socket.emit("private-message", {sender_id, receiver_id, scroll:false});
      setFlag(false)
    }
  }, [flag])

  return (
    <div
      className={`${style.container} text-sm
      ${sender_id === user.user_id ? style.myMessage : style.elseMessage}`}
    >
      <div className='flex justify-between gap-[10px] '>
        <span
          className={`text-sm mb-[0px] `}
        >{formatDate(new Date(createdAt))}</span>
        {
          sender_id === user.user_id &&
            <select  onChange={handleOptionChange} className={ `${style.selectMessage}`}>
              <option value="default" hidden></option>
              <option value={"eliminar"} >Eliminar</option>
            </select>
        }

      </div>
      <div>
        {
          file?.split(".")[1] === "mp4"  &&
          <div className='flex flex-col'>
            <video controls>
              <source src={`${apiUrl}/${file}`}></source>
            </video>
            <button
              onClick={(event) => {downloadFileFromURL(event, `${apiUrl}/${file}`)}}
            >Dowload</button>
          </div>
        }
      </div>
      <div>
        {
          (file !== "" && file !== null && !(file.split(".")[1] === "mp4")) && <FilePreviewMessage file={file} filePreview={filePreview} />
        }
      </div>

      <span className='ml-[5px] text-md  flex text-left'>{content}</span>

    </div>
  )
}

export default Message