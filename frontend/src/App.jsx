// App.jsx - Main React component for image upload and AI processing UI
// Imports CSS module for styling
import styles from "./App.module.css";

// Import React hooks
import { useState, useRef } from "react";

function App() {
  // State for output string shown to user
  const [outString, setOutString] = useState("Select Image");
  // State for uploaded image URL (for preview)
  const [imageUploadedUrl, setImageUploadedUrl] = useState(null);
  // Ref to hold base64 string to send to backend
  const imageBase64ToSend = useRef(null);

  // ----------------------- DEFINES ---------------------- //
  //we detect the base64,/part and grab everything after it
  //this is the base64 image we send to the backend for processing
  const regexForBase64Image = /(?<=base64.).+/;
  // Backend endpoints for AI processing
  // const BACKEND_URL = "https://mrlvl5m1be.fluffyb.net/ident";
  const BACKEND_URL_TRAINED = "http://localhost:4000/identTrained";
  const BACKEND_URL_PLAIN = "http://localhost:4000/identPlain";

  // --------------------- FILE UPLOAD -------------------- //

  function handleFileUpload(e) {
    const imageFile = e.target.files[0]; // Get selected file
    const fileReader = new FileReader(); // Create FileReader
    fileReader.readAsDataURL(imageFile); // Read file as DataURL
    fileReader.onload = () => {
      console.log(fileReader.result);
      // Set image preview
      setImageUploadedUrl(fileReader.result);
      //destructure the array from Regex.exec()
      //Regex.exec() strips un needed info from the base 64
      const [imageBase64] = regexForBase64Image.exec(fileReader.result);
      imageBase64ToSend.current = imageBase64;
      console.log(imageBase64ToSend.current);
      // Update output string
      setOutString("Ready");
    };
  }
  // --------------------- TRAINED AI --------------------- //

  async function sendToBackendTrained() {
    // console.log(imageBase64ToSend.current)
    let tempOutString = "";
    const resp = await fetch(BACKEND_URL_TRAINED, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        image: imageBase64ToSend.current,
      }),
    });
    const data = await resp.json();
    const imageInfo = data.data;

    // Build output string from tags and confidence values
    for (const tagArr of imageInfo) {
      console.log(tagArr);
      if (!tempOutString) {
        tempOutString += `${tagArr.tag} with a confidence of ${(tagArr.confidence * 100).toFixed(2)} %\n`;
      } else {
        tempOutString += ` and a ${tagArr.tag} with a confidence of ${(tagArr.confidence * 100).toFixed(2)} %`;
      }
    }

    setOutString(`AI Thinks this is a ${tempOutString}\n`);
  }

  // ---------------------- NORMAL AI --------------------- //

  async function sendToBackendPlain() {
    console.log(imageBase64ToSend.current);
    const resp = await fetch(BACKEND_URL_PLAIN, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        image: imageBase64ToSend.current,
      }),
    });
    const data = await resp.json();
    // Get first detected object annotation
    const imageInfo = data.data.localizedObjectAnnotations[0];
    setOutString(
      `AI Thinks this is a ${imageInfo.name} with a certinty of ${(imageInfo.score * 100).toFixed(2)} %`
    );
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
        {/* File input for image upload */}
        <input
          type="file"
          onChange={handleFileUpload}
        />
        {/* Show uploaded image preview if available */}
        {imageUploadedUrl && (
          <img
            className={styles.image}
            src={imageUploadedUrl}></img>
        )}
        {/* Output string from AI */}
        <p>{outString}</p>
        {/* Buttons to trigger AI processing */}
        <button onClick={sendToBackendPlain}>process photo plain</button>
        <button onClick={sendToBackendTrained}>process photo trained</button>
      </main>
    </>
  );
}

// Export main App component
export default App;
