import styles from "./App.module.css";

import { useState, useRef } from "react";

function App() {
  const [outString, setOutString] = useState("hello world");
  const [imageUploadedUrl, setImageUploadedUrl] = useState(null);
  const imageBase64ToSend = useRef(null)

// ----------------------- DEFINES ---------------------- //
//we detect the base64,/part and grab everything after it
//this is the base64 image we send to the backend for processing 
const regexForBase64Image = /(?<=base64.\/).+/
const BACKEND_URL= "http://localhost:3000/api/test"

  function handleFileUpload(e) {
    const imageFile = e.target.files[0]
    const fileReader = new FileReader()
    fileReader.readAsDataURL(imageFile)
    fileReader.onload= ()=>{
      console.log(fileReader.result)
      //set image to be visible on the page
      setImageUploadedUrl(fileReader.result)
      //destructure the array from Regex.exec()
      const [imageBase64] =regexForBase64Image.exec(fileReader.result)
      setOutString(imageBase64)

    }
  }


  async function sendToBackend(){
    const resp = fetch()
  }

  return (
    <>
      {/* // ----------------------- NAVBAR ----------------------- // */}

      <nav>
        <div className={styles.navContainer}></div>
      </nav>
      {/* // ----------------------- HEADER ----------------------- // */}

      <div className={styles.header}>
        <h1>Seth Samuel mission 1</h1>
      </div>
      <main className={styles.mainContainer}>
        <input
          type="file"
          onChange={handleFileUpload}
        />
        {imageUploadedUrl && <img className={styles.image} src={imageUploadedUrl}></img>}
        <p>{outString}</p>
        <button onClick={sendToBackend} >process photo</button>
      </main>
    </>
  );
}

export default App;
