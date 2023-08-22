import React, { useEffect, useRef } from 'react'
import style from './Messages.module.css'
import { useSelector } from 'react-redux';
import Message from '../Message/Message';
import { selectSelectedUser } from '../../redux/appSlice';
import FilePreview from '../FilePreview/FilePreview';

const Messages = ({socket, preview, selectedFile, filePreview, handleCancelUpload, messagePrivateFile}) => {
// *================  ESTADOD GLOBALES =====================
  const selectedUser = useSelector(selectSelectedUser)

  const messagesRef = useRef(null);

  useEffect(() => {
    const messageContainer = messagesRef.current;
    messageContainer && (messageContainer.scrollTop = messageContainer.scrollHeight);
  },[selectedUser, preview])

  return (
    <div
      ref={messagesRef}
      className={`w-[100%] h-[calc(100%-120px)] pl-[5px] pr-[5px] bg-white items-end flex-col overflow-y-auto ${style.customScrollbar}`}
    >
      {
        selectedUser?.Messages?.map((item, index) => (
          <Message
            key={index}
            sender_id={item.sender_id}
            createdAt={item.createdAt}
            content={item.content}
            file={item.file}
            filePreview={filePreview}
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