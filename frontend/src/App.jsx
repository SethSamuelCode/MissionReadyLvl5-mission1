import styles from './App.module.css'

import { useState } from 'react';

function App() {
  const [outString, setOutString] = useState("hello world")

  return (
    <>
      {/* // ----------------------- NAVBAR ----------------------- // */}

      <nav>
        <div className={styles.navContainer} >

        </div>
      </nav>
{/* // ----------------------- HEADER ----------------------- // */}

      <div className={styles.header}>
        <h1>
          Seth Samuel mission 1
        </h1>
      </div>
      <main className={styles.mainContainer}>
        <button>import photo</button>
        <p>{outString}</p>
      </main>
    </>
  );
}

export default App;
