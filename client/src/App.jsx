import React, { useEffect } from 'react'
import { Route, Routes, useLocation, useRoutes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Inicio from './components/Inicio/Inicio'
import Home from './components/Home/Home'
import NotFound from './components/NotFound/NotFound'
import Register from './Pages/Register/Register'
import Login from './Pages/Login/Login'
import Chat from './Pages/Chat/Chat'
import NavBar from './components/NavBar/NavBar'
import { setUser } from './redux/usersSlice'
import { setSelectedUser } from './redux/appSlice'

const App = () => {

  const token = useSelector(state => state.users.token);
  const access = useSelector(state => state.users.access);
  const isMinimized = useSelector(state => state.isMinimized);
  const listChats = useSelector(state => state.app.listChats);
  const dispatch = useDispatch();
  //const location = useLocation();
  //console.log(location)
  const loggedUserJSON = window.localStorage.getItem('loggedChatUser')

  useEffect(() => {
    if (loggedUserJSON){
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
    }
  }, []);

  return (
    <div className='flex h-[calc(100vh-72px)] mt-[72px] top-[72px] flex-col w-[100%] justify-center items-center  first-line:'>
      { !access && !loggedUserJSON ? <Login /> : <NavBar /> }
      <div>{!isMinimized && <Chat />}</div>
      <Routes>
        <Route path={'/inicio'} element={<Inicio />} />
        <Route path={'/home'} element={<Home />} />
        <Route path={'/register'} element={<Register />} />
        <Route path={'/chat'} element={<Chat />} />
        <Route path={'/*'} element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App