import React from 'react'
import { NavLink } from 'react-router-dom'
import style from './NavBar.module.css'

const NavBar = () => {
  const activeStyle = 'underline'

  return (
    <nav className={`${style.nav} fixed w-[100%] h-[80px] py-5 px-8 text-sm font-light border-2 top-0 bg-blue-950 text-white`}>
      <ul className='flex items-center gap-3'>
        <li className='flex items-center font-semibold text-lg'>
          <NavLink
            to={'/inicio'}
            className={({isActive}) => isActive ? activeStyle: undefined }
          >
            Inicio
          </NavLink>
        </li>
        <li className='flex items-center text-sm' >
          <NavLink
            to={'/home'}
            className={({isActive}) => isActive ? activeStyle: undefined }
          >
            Home
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default NavBar