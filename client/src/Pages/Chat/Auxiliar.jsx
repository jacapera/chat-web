import React from 'react'

const Auxiliar = () => {
  return (
    <div>

<div
                className='text-white flex-col w-full h-[calc(100%-60px)] flex'
              >
                {/* cuerpo del chat aca se renderizan todos los mensajes */}
                <ul ref={messagesRef} className={`w-[100%] h-[calc(100%-60px)] pl-[40px] pr-[10px] bg-white items-end flex-col overflow-y-auto custom-scrollbar`}>
                  {
                    selectedUser?.Messages?.map((item, index) => (
                      // *CONTENEDOR PRINCIPAL DE CADA MENSAJE INDIVIDUAL
                      //*-------------------------------------------------
                      <li key={index}
                      className={` my-[2px] mx-[3px] p-1 table text-sm w-[auto] max-w-[60%] rounded-md
                      ${item.sender_id === user.user_id ? "bg-blue-200 text-blue-900 ml-auto" : "li-message mr-[auto] ml-[25px] rounded-tl-[0%]"}
                      `}>
                        {/* //*Contenedor para la imagen de perfil, userName, hora mensaje */}
                        <div className='flex items-center w-full gap-2 px-1 mt-0 mb-1'>
                          { /** validación mostrar foto de quien envia mensaje */
                            item.sender_id !== user.user_id && <div className='flex w-[40px] h-[40px] rounded-full bg-gray-500 relative right-[55px]'>
                              <img className='w-full h-full object-cover rounded-full' src={`${apiUrl}/${item.User.image}`} alt='foto de perfil' />
                            </div>
                          }
                          { /** Validación para mostrar userName de quien envia mensaje */
                            item.sender_id !== user.user_id &&
                              <span
                                className='text-[18px] font-bold text-slate-300 flex relative right-[40px]'
                              >{item.User.userName}</span>
                          }
                          {/** mostrar hora mensaje, validación para ajustar ubicación mensaje recibido */}
                          <span
                            className={`text-sm text-slate-500 flex relative ${item.sender_id !== user.user_id && "right-[37px]"}`}
                          >{formatDate(new Date(item.createdAt))}</span>
                        </div>
                        {/* <PDFPreview src={`data:${message.file.type};base64,${arrayBufferToBase64(message.file.data)}`} name={message.file.name}/> */}
                        { /** Validación si vienen archivo adjunto se renderize */
                          item.file?.data &&
                          (
                            <div className='flex flex-col justify-center items-center w-[100%] h-[30%]'>
                              {
                                item.file.type === "application/pdf" && item.file.data instanceof ArrayBuffer ?
                                  <PDFPreview src={arrayBufferToUrl(item.file?.data, item.file?.type)} name={item.file.name}/>:
                                  <img
                                    src={item.file && item.file.data instanceof ArrayBuffer ? `data:${item.file.type};base64,${arrayBufferToBase64(item.file.data)}`: filePreview}
                                    alt={item.file.name}
                                    className='flex w-[200px] object-scale-down'
                                  />
                              }
                              {/** descargar archivo adjunto */}
                              <button onClick={(event) => {downloadFile(event, item.file)}}
                              >Download</button>
                            </div>
                          )
                        }
                        {/** rederizar mensaje */}
                        <span className='ml-[5px] text-md  flex text-left'>{item.content}</span>
                      </li>
                    ))
                  }
                  { /** Validación para renderizar si se va enviar archivo adjunto */
                    preview &&
                      (  // *CONTENEDOR PRINCIPAL PREVISUALIZACION ENVIO ARCHIVO ADJUNTO
                        <div className='flex flex-col w-[100%] h-[80%] border-[3px] p-3 rounded-md my-2 justify-around items-center'>
                          {/** cerrar o cancelar previsualización */}
                          <div className='flex mb-[5px] w-[100%]'>
                            <button
                              className='flex justify-center items-center w-[20px] h-[20px] font-bold bg-red-500 rounded-md'
                              onClick={handleCancelUpload}
                            >x</button>
                          </div>
                          {/** previsualización de archivo adjunto */}
                          {/* <PDFPreview url={filePreview} name={selectedFile.name} /> */}
                          {
                            selectedFile && (selectedFile.type === "application/pdf") ?
                                <PDFPreview url={filePreview} name={selectedFile.name} /> :
                                <img src={filePreview}
                                  className='w-[100%] h-[80%] object-scale-down'
                                />
                          }
                          {/** icono de enviar */}
                          <div className='flex justify-end w-[100%]'>
                            <button
                              className='flex justify-center items-center w-[auto] h-[auto] p-[4px] font-bold bg-green-400 rounded-[50%]'
                              onClick={messagePrivateFile} // handleSubmitFile
                            >
                              <img src={enviarIcon} className='w-[40px] h-[40px] mr-[6px]' />
                            </button>
                          </div>
                        </div>
                      )
                  }
                </ul>
              </div>
        
    </div>
  )
}

export default Auxiliar