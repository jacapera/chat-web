import React from 'react'
import { useSelector } from 'react-redux';
import image from '../../assets/cool-rick-and-morty-fighting-aliens-2qy1xyshw0h9uxk4.jpg'

const Home = () => {
  const userName = useSelector(state => state.userName);
  const isLogin = useSelector(state => state.isLogin);
  return (
    <div className='flex w-full h-[calc(100vh-80px)] justify-center bg-cover  '
    style={{backgroundImage:`url(${image})`}}
    >
    </div>
  )
}

export default Home