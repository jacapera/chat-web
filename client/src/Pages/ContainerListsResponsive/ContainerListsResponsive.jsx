import React from 'react'
import AddCommentIcon from '@mui/icons-material/AddComment';
import ListUsers from '../../components/ListUsers/ListUsers';
import ListChat from '../../components/ListChat/ListChat';
import { useDispatch, useSelector } from 'react-redux';
import style from './ContainerListsResponsive.module.css';
import { setNewChat, setScroll, setSelectedUser } from '../../redux/appSlice';
import { useLocation, useNavigate } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_URL_API;

const ContainerLists = ({socket}) => {
// *================  ESTADOD GLOBALES =====================
  const user = useSelector(state => state.users);
  const newChat = useSelector(state => state.app.newChat);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Seleccionar un usuario
  const handleUserSelection = (user) => {
    dispatch(setSelectedUser(user));
    //console.log('selectedUser: ',selectedUser);
    dispatch(setScroll(true))
    if(location.pathname === '/view-list' || location.pathname === '/chat'){
      navigate('/view-message')
    }
  };

  const handleNewChat = (event) => {
    dispatch(setNewChat(!newChat))
  }

  return (
    <div className={`${style.container}
      ${(
        location.pathname === '/view-message' ||
        location.pathname === '/register' ||
        location.pathname === '/login'
      ) && 'hidden'}`}
    >
      <div className='flex justify-between items-center p-[5px] pr-[15px]  bg-slate-400 w-[100%] h-[60px]'>
        <div className='flex w-[100%] gap-[5px]'>
          <div className='flex w-[50px] h-[50px] ml-[5px] rounded-full bg-gray-500'>
            <img className='w-full h-full object-cover rounded-full' src={`${apiUrl}/${user.image}`} alt='imagen de perfil' />
          </div>
          <h1 className='my-2 text-[25px]'>{user.userName}</h1>
        </div>
        <AddCommentIcon onClick={handleNewChat} className='text-blue-700 cursor-pointer' />
      </div>

      <div className='flex w-[100%]'>
        {newChat && <ListUsers onUserSelect={handleUserSelection} socket={socket}  />}
      </div>
      <div className='flex w-[100%]'>
        {!newChat && <ListChat onUserSelect={handleUserSelection} socket={socket} />}
      </div>
    </div>
  )
}

export default ContainerLists