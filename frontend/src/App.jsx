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
  // const BACKEND_URL_PLAIN = import.meta.env.VITE_BACKEND_URL_PLAIN || "http://localhost:4000/identPlain";
  const BACKEND_URL_PLAIN = "http://localhost:4000/identPlain";

  // --------------------- FILE UPLOAD -------------------- //

  function handleFileUpload(e) {
    const imageFile = e.target.files[0]; // Get selected file
    const fileReader = new FileReader(); // Create FileReader for reading data from the user
    fileReader.readAsDataURL(imageFile); // Read file as DataURL . this will get our Base64 image data as a string for the google endpoint
    fileReader.onload = () => {
      console.log(fileReader.result);
      // Set image preview
      setImageUploadedUrl(fileReader.result);
      //destructure the array from Regex.exec()
      //Regex.exec() strips un needed info from the base64 string
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
    // console.log(imageBase64ToSend.current);
    console.log(BACKEND_URL_PLAIN)
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
    setOutString(`AI Thinks this is a ${imageInfo.name} with a certainty of ${(imageInfo.score * 100).toFixed(2)} %`);
  }

  return (
    <>
      {/* // ----------------------- HEADER ----------------------- // */}
      <div className={styles.header}>
        <h1>Car Identifier</h1>
      </div>
      <main className={styles.mainContainer}>
        {/* File input for image upload */}
        {/* Show uploaded image preview if available */}
        {imageUploadedUrl && (
          <img
            className={styles.image}
            src={imageUploadedUrl}></img>
        )}
        {/* Output string from AI */}
        <p>STATUS:</p>
        <p>{outString}</p>
        <div className={styles.fileInput}>
          <input
            type="file"
            id="filePicker"
            onChange={handleFileUpload}
            className={styles.filePicker}
          />
          <label
            htmlFor="filePicker"
            className={styles.buttonLabel}>
            Upload image
          </label>
        </div>
        {/* Buttons to trigger AI processing */}
        <button
          onClick={sendToBackendPlain}
          className={styles.processButton}>
          process photo plain
        </button>
        <button
          onClick={sendToBackendTrained}
          className={styles.processButton}>
          process photo trained
        </button>
      </main>
    </>
  );
}

// Export main App component
export default App;
