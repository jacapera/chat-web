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
        

      {/* //*CONTENEDOR PRINCIPAL PANEL IZQUIERDO */}
            {/* <div className='flex flex-col bg-white border-2 border-slate-400 w-[30%] h-full '> */}

              {/* ENCABEZADO IZQUIERDO (mi foto y username)*/}
              {/* <div className='flex justify-between items-center p-[5px] top-[70]  bg-slate-400 w-[29.3%] h-[60px] fixed'>
                <div className='flex gap-[5px]'>
                  <div className='flex w-[50px] h-[50px] ml-[5px] rounded-full bg-gray-500'>
                    <img className='w-full h-full object-cover rounded-full' src={`${apiUrl}/${image}`} alt='imagen de perfil' />
                  </div>
                  <h1 className='my-2 text-[25px]'>{userName}</h1>
                </div>
                <AddCommentIcon onClick={handleNewChat} className='text-blue-700 cursor-pointer' />
              </div> */}

              {/* <div>
                {newChat && <ListUsers onUserSelect={handleUserSelection} socket={socket} messages={messages} />}
              </div>
              <div>
                {!newChat && <ListChat onUserSelect={handleUserSelection} socket={socket} />}
              </div>
            </div> */}



    </div>
  )
}

export default Auxiliar


//{/* //* CONTENEDOR PRINCIPAL PANEL DERECHO */}
//<div className='flex flex-col w-[70%] h-[calc(100vh-70px)] relative pb-[0px] border-2 border-slate-500 bg-white'>
{/* ENCABEZADO DERECHO (foto y nombre del Chat actual, ya se grupal o individual) */}
{/* <div className='flex justify-between items-center pr-[15px] gap-1 bg-slate-500 w-[100%] h-[60px] '>
  <div className='flex items-center  ml-[5px] gap-3'>
    <div className='flex w-[50px] h-[50px] rounded-full bg-gray-500'> */}
      {/* Foto del grupo o usuario al que se le envia mensajes */}
  //     <img className='w-full h-full object-cover rounded-full'
  //       src={(selectedUser?.UserReceived?.userName === user.userName)
  //         ? `${apiUrl}/${selectedUser?.UserSent?.image}`
  //         : `${apiUrl}/${selectedUser?.UserReceived?.image}` } alt='foto de perfil'
  //     />
  //   </div>
  //   <h2 className='my-2 font-bold text-[25px]'>
  //     {selectedUser?.UserReceived?.userName === user.userName
  //       ? selectedUser?.UserSent?.userName
  //       : selectedUser?.UserReceived?.userName}</h2>
  // </div>
  {/* BOTONES CHAT */}
  // <div className='flex gap-3 p-2'>
    {/* minimizar chat*/}
    // <button
    //   onClick={toggleMinimize}
    //   className='flex justify-center items-center border-l border-r h-5 w-5 bg-gray-300 border-blue-950 rounded-md'
    // ><h1 className='text-lg'>-</h1></button>
    {/* cerrar chat*/}
//     <button
//       onClick={exitChat}
//       className='flex justify-center items-center border-l border-r h-5 w-5 bg-gray-300 border-blue-950 rounded-md'
//     ><h1 className='text-lg'>x</h1></button>
//   </div>
// </div>

{/* //*CONTENEDOR DEL CHAT */}
{/* <Messages
  socket={socket}
  messagePrivateFile={messagePrivateFile}
  handleCancelUpload={handleCancelUpload}
  selectedFile={selectedFile}
  filePreview={filePreview}
  preview={preview}
/> */}


{/** //*CONTENEDOR DEL FORM, INPUT PARA TIPEAR MENSAJE */}
{/** //*-------------------------------------------- */}
{/* <form onSubmit={messagePrivateFile}>
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
    /> */}
    {/* ENVIAR */}
//     <button
//       type='submit'
//       className='bg-green-500 px-[8px] py-[9px] rounded-[50%] mx-2 hover:scale-110 flex justify-center items-center'
//     >
//       <img src={enviarIcon} className='w-[40px] h-[40px] mr-[6px]' />
//     </button>
//   </div>
// </form>

// </div>

