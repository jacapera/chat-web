import React from 'react'
import { useSelector } from 'react-redux'
import style from './Message.module.css'
import FilePreviewMessage from '../FilePreviewMessage/FilePreviewMessage'

const Message = ({sender_id, createdAt, content, file, filePreview}) => {

// *================  ESTADOD GLOBALES =====================
  const user = useSelector(state => state.users);

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

  return (
    <div
      className={` my-[2px] mx-[10px] p-[15px] text-sm w-fit max-w-[60%] rounded-lg
      ${sender_id === user.user_id ? "bg-blue-200 text-blue-900 ml-auto rounded-tr-[0%]" : "bg-blue-900 mr-[auto] text-blue-100 ml-[25px] rounded-tl-[0%]"}`}
    >
      {/* <span
        className='text-[18px] font-bold text-slate-300 flex relative right-[40px]'
      >{item.User.userName}</span> */}

      <span
        className={`text-sm `}
      >{formatDate(new Date(createdAt))}</span>

      {
        file && <FilePreviewMessage file={file} filePreview={filePreview} />
      }

      <span className='ml-[5px] text-md  flex text-left'>{content}</span>

    </div>
  )
}

export default Message