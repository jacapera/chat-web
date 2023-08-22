import React from 'react'
import image from '../../assets/rick-and-morty-trippy-parallel-universe-qvw8fevdnlpo8xp9.jpg'

const Inicio = () => {
  return (
    <div className='flex w-full h-full justify-center bg-cover'
    style={{backgroundImage:`url(${image})`}}
    >Inicio</div>
  )
}

export default Inicio