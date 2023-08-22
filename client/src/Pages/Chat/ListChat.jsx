import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setListChats, setSelectedUser } from '../../redux/appSlice';
const apiUrl = import.meta.env.VITE_URL_API;

const ListChat = ({ onUserSelect, socket }) => {

  // *------------- Estados Globales --------------
  const listChats = useSelector(state => state.app.listChats);
  const user = useSelector(state => state.users);
  const selectedUser = useSelector(state => state.app.selectedUser)

  const dispatch = useDispatch();

  const getChats = (user_id) => {
    axios.get(`${apiUrl}/api/v1/chats/${user.user_id}`,{
      headers: {
        "Authorization": `Bearer ${user.token}`,
        "Content-Type": "application/json",
      }
    }).then((response) => {
      const chatsWithDate = response.data.map(item => ({
        ...item,
        updated_at: new Date(item.updated_at)
      }))
      const orderedChats = chatsWithDate.sort((a, b) =>
        b.updated_at - a.updated_at  )
      const chatsUpdateString = orderedChats.map(item => ({
        ...item,
        updated_at: item.updated_at.toISOString()
      }))
      dispatch(setListChats(chatsUpdateString))
    })
  };

  useEffect(() => {
    if(user.access){
      getChats(user.user_id);
      console.log("listChat: ", listChats)
    }
  }, [user.access]);

  return (
    <div >
      {
        listChats.map((item, index) =>
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
                      <h2>{item.Messages[item.Messages.length-1]?.content}</h2>
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