import React, { useEffect, useRef } from 'react'
import style from './Messages.module.css'
import { useSelector } from 'react-redux';
import Message from '../Message/Message';
import { selectSelectedUser } from '../../redux/appSlice';
import FilePreview from '../FilePreview/FilePreview';

const Messages = ({
  socket, preview, selectedFile, filePreview,
  handleCancelUpload, messagePrivateFile
}) => {

// *================  ESTADOD GLOBALES =====================
  const selectedUser = useSelector(selectSelectedUser)
  const listChats = useSelector(state => state.app.listChats)
  const scroll = useSelector(state => state.app.scroll)

  const messagesRef = useRef(null);

  useEffect(() => {
    if(scroll || preview ){
      const messageContainer = messagesRef.current;
      messageContainer && (messageContainer.scrollTop = messageContainer.scrollHeight);
    }
  },[listChats, selectedUser, preview, filePreview])
  //console.log(preview)
  return (
    <div
      ref={messagesRef}
      className={`${style.customScrollbar}`}
    >
      {
        selectedUser?.Messages?.map((item, index) => (
          <Message
            key={index}
            message_id={item.message_id}
            sender_id={item.sender_id}
            receiver_id={item.receiver_id}
            createdAt={item.createdAt}
            content={item.content}
            file={item.file}
            filePreview={filePreview}
            socket={socket}
          />
        ))
      }
      {
        preview && <FilePreview
          socket={socket}
          messagePrivateFile={messagePrivateFile}
          handleCancelUpload={handleCancelUpload}
          selectedFile={selectedFile}
          filePreview={filePreview}
        />
      }
    </div>
  )
}

export default Messages