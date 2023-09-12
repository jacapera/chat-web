import React from 'react'
import PDFPreview from '../PDFPreview/PDFPreview'
const apiUrl = import.meta.env.VITE_URL_API;

const FilePreviewMessage = ({file, filePreview}) => {

  // Función para descargar el archivo adjunto
  const downloadFile = (event, fileData) => {
    event.preventDefault();
    const {name, size, type, lastModifiedDate, lastModified, data} = fileData;
    const blob = new Blob([data], {type});
    // Establecer el nombre del archivo de descarga (nombre con el que se guardará en el disco)
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = `${apiUrl}/${fileData}`;
    link.download = fileData.split("/").pop();
    link.click();
  };

  const downloadFileFromURL = (event, fileURL) => {
    event.preventDefault();
    console.log(fileURL)
    const link = document.createElement('a');
    link.href = fileURL;
    link.download = fileURL.split("/").pop();
    link.target = '_blank';
    link.click()
  }

  // Función para convertir un ArrayBuffer a base64
  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const arrayBufferToUrl = (buffer, fileType) => {
    const blob = new Blob([buffer], { type: fileType });
    const url = URL.createObjectURL(blob)
    //console.log(url)
    //window.open(url)
    return url;
  };

  //Acortar el ultimo mensaje para mostrar en la lista de chats
  const shorteningMessage = (message) => {
    //console.log(location)
    if(message && message.length > 20){
      return message.slice(0, 20) + "..." + message.split(".").pop();
    }
    return message
  }


  return (
    <div
      className='flex flex-col justify-center items-center w-[100%] h-[100%]'
    >
      {/* {
        (file === "application/pdf" && file.data instanceof ArrayBuffer)
          ? <PDFPreview src={arrayBufferToUrl(file?.data, file?.type)} name={file.name} />
          : <img
          src={`${apiUrl}/${file}`}
            // src={file && file.data instanceof ArrayBuffer ? `data:${file.type};base64,${arrayBufferToBase64(file.data)}`: filePreview}
            alt={file}
            className='flex w-[200px] object-scale-down'
            />
      } */}
        <h2>{shorteningMessage(`${file.split("/").pop()}`)}</h2>
      {
        // file && file.split(".").pop() === "pdf"
        //   ? <PDFPreview src={`${apiUrl}/${file}`} name={`${file.split("/").pop()}`} /> :
          <img
            className='flex w-[200px] object-scale-down'
            src={`${apiUrl}/${file}`} alt={`archivo de tipo ${file.split(".").pop()}`}
          />
      }
      <button
        onClick={(event) => {downloadFileFromURL(event, `${apiUrl}/${file}`)}}
      >Dowload</button>
    </div>
  )
}

export default FilePreviewMessage