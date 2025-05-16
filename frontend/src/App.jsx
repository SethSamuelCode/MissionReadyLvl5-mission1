import styles from "./App.module.css";

import { useState, useRef } from "react";

function App() {
  const [outString, setOutString] = useState("hello world");
  const [imageUploadedUrl, setImageUploadedUrl] = useState(null);

  function handleFileUpload(e) {
    const imageFile = e.target.files[0]
    const fileReader = new FileReader()
    fileReader.readAsDataURL(imageFile)
    fileReader.onload= ()=>{
      console.log(fileReader.result)
      setImageUploadedUrl(fileReader.result)

    }
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
        <button>process photo</button>
      </main>
    </>
  );
}

export default App;
