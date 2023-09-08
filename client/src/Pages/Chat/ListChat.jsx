import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setListChats, listChatsByUser } from '../../redux/appSlice';
const apiUrl = import.meta.env.VITE_URL_API;

const ListChat = ({ onUserSelect }) => {

  // *------------- Estados Globales --------------
  const listChats = useSelector(state => state.app.listChats);
  const user = useSelector(state => state.users);

  const dispatch = useDispatch();

  //Acortar el ultimo mensaje para mostrar en la lista de chats
  const shorteningMessage = (message) => {
    if(message.length > 15){
      return message.slice(0, 15) + "...";
    }
    return message
  }

  // Cargar la lista de chats cuando el usuario se logea
  useEffect(() => {
    if(user.access){
      dispatch(listChatsByUser({user_id:user.user_id, token: user.token}))
        .then(response => {
          dispatch(setListChats(response.payload))
        }).catch(error => {
          console.log("ERROR: ", error);
        })
      //console.log("listChat: ", listChats)
    }
  }, [user.access]);

  return (
    <div >
      {
        listChats?.map((item, index) =>
        (
          <div key={index} onClick={() => onUserSelect(item)}
            className='cursor-pointer'
          >
              {
                (item.UserSent !== user.userName && item.UserReceiver !== user.userName)&&
                <div>
                  <div className='flex w-full p-[5px] items-center gap-[10px] border-2 border-blue-600'>
                    <img src={(item.UserSent.userName !== user.userName) ? `${apiUrl}/${item.UserSent.image}` : `${apiUrl}/${item.UserReceived.image}`}
                    className='flex w-[50px] h-[50px] object-cover rounded-full'
                    />
                    <div>
                      <h2
                        className='font-bold'
                      >{(item.UserSent.userName !== user.userName) ? item.UserSent.userName : item.UserReceived.userName}</h2>
                      <h2>{shorteningMessage(item.Messages[item.Messages.length-1]?.content)}</h2>
                    </div>
                  </div>
                </div>
              }
          </div>
        ))
      }
    </div>
  )
}

export default ListChat