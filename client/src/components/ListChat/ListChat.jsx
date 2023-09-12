import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setListChats, listChatsByUser, setScroll } from '../../redux/appSlice';
import style from './LIstChat.module.css';
import { useLocation } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_URL_API;

const ListChat = ({ onUserSelect }) => {

  // *------------- Estados Globales --------------
  const listChats = useSelector(state => state.app.listChats);
  const user = useSelector(state => state.users);

  const dispatch = useDispatch();
  const location = useLocation();

  //Acortar el ultimo mensaje para mostrar en la lista de chats
  const shorteningMessage = (message) => {
    //console.log(location)
    if(message && message.length > 15){
      return message.slice(0, 15) + "...";
    }
    return message
  }

  const handleChange = (event) => {

  }

  // Cargar la lista de chats cuando el usuario se logea
  useEffect(() => {
    if(user.access){
      dispatch(listChatsByUser({user_id:user.user_id, token: user.token}))
        .then(response => {
          dispatch(setListChats(response.payload))
          dispatch(setScroll(true))
        }).catch(error => {
          console.log("ERROR: ", error);
        })
      //console.log("listChat: ", listChats)
    }
  }, [user.access]);

  return (
    <div className={`${style.container}`}>
      <div className='flex p-[8px] border-[1px]  w-[100%] '>
        <input type='text' value={""} onChange={handleChange}
          placeholder='busca un chat'
          className='border-2 p-[5px] w-[100%] rounded-md '
        />
      </div>
      {
        listChats.length > 0 && listChats?.map((item, index) =>
        (
          <div key={index} onClick={() => onUserSelect(item)}
            className='w-[100%] cursor-pointer'
          >
              {
                (item.UserSent !== user.userName && item.UserReceiver !== user.userName)&&
                <div className='w-[100%]'>
                  <div className='flex w-[100%] p-[5px] items-center gap-[10px] shadow'>
                    <img src={(item.UserSent.userName !== user.userName) ? `${apiUrl}/${item.UserSent.image}` : `${apiUrl}/${item.UserReceived.image}`}
                    className='flex w-[50px] h-[50px] object-cover rounded-full'
                    />
                    <div className='w-[100%]'>
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