import React from 'react'

const PDFPreview = ({ url, name }) => {
  return (
    <div className='flex flex-col h-full justify-center items-center gap-[5px]'>
      <h1 className='text-xl text-black'>{name}</h1>
      <iframe
        className='flex h-[100%]'
        src={url}
        title="PDF Preview"
      />
    </div>
  )
}

export default PDFPreview