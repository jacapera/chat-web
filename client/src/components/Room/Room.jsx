import React from 'react'
import io from 'socket.io-client'

const socket = io('http://localhost:3007')

const Room = () => {
  return (
    <div>Room</div>
  )
}

export default Room