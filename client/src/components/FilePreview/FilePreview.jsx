import React, { useState } from 'react'
import enviarIcon from '../../assets/enviar.png'
import PDFPreview from '../PDFPreview/PDFPreview'
import { selectSelectedUser } from '../../redux/appSlice'
import { useSelector } from 'react-redux'

const FilePreview = ({selectedFile, filePreview, handleCancelUpload, messagePrivateFile }) => {

// *================  ESTADOD LOCALES ======================
  const [messageFile, setMessageFile] = useState(null);

  // *================  ESTADOD GLOBALES =====================
  const selectedUser = useSelector(selectSelectedUser)
  const user = useSelector(state => state.users);

  //console.log(filePreview)

  return (
    <div
      className='flex flex-col w-[100%] h-[80%] border-[3px] p-3 rounded-md my-2 justify-around items-center'
    >
      {/** cerrar o cancelar previsualización */}
      <div className='flex mb-[5px] w-[100%]'>
        <button
          className='flex justify-center items-center w-[20px] h-[20px] font-bold bg-red-500 rounded-md'
          onClick={handleCancelUpload}
        >x</button>
      </div>
      {
        selectedFile && (selectedFile.type === "application/pdf")
          ? <PDFPreview url={filePreview} name={selectedFile.name} />
          : <img src={filePreview}
              className='w-[100%] h-[80%] object-scale-down'
            />
      }
      {/** icono de enviar */}
      <div className='flex justify-end w-[100%]'>
        <button
          className='flex justify-center items-center w-[auto] h-[auto] p-[4px] font-bold bg-green-400 rounded-[50%]'
          onClick={(event)=>messagePrivateFile(event)} // handleSubmitFile
        >
          <img src={enviarIcon} className='w-[40px] h-[40px] mr-[6px]' />
        </button>
      </div>

    </div>
  )
}

export default FilePreview