import React from 'react'
import { NavLink } from 'react-router-dom'
import style from './NavBar.module.css'

const NavBar = () => {
  const activeStyle = 'underline'

  return (
    <nav className={`${style.nav}`}>
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