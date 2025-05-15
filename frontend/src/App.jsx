import styles from './App.module.css'

function App() {

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
        <p>response from server</p>
      </main>
    </>
  );
}

export default App;
