import { useEffect, useState } from "react";
import { Me } from './types'
import styles from "./App.module.css";
import ProfileSidebar from "./components/ProfileSidebar/ProfileSidebar";

function App() {
  // useState<Me | null> means: this variable is EITHER a Me object,
  // OR null (when we don't know yet / user isn't logged in).
  // The `| null` part is a TypeScript "union type".
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  const redirectToLogin = () => {
	window.location.href = "http://localhost:4000/login";
  }

  // useEffect runs this code once, when the component first renders.
  // Here: ask the server "am I logged in?"
  useEffect(() => {
    fetch("http://localhost:4000/me")
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then((data: Me) => setMe(data))
      .catch(() => setMe(null))
      .finally(() => setLoading(false));
  }, []); // empty array = "only run this once"

  if (loading) {
    return <p>Loading…</p>;
  }

  if (!me) {
    return (
      <div className={styles.app}>
		<div className={`${styles.appContainer} ${styles.loginPage}`}>
			<h1>EVE Tool</h1>
			{/* This is a plain link, not a fetch — clicking it navigates
				the whole browser to the server, which redirects to EVE's
				login page. */}
			<button className={styles.loginButton} onClick={redirectToLogin}></button>
		</div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
		<div className={styles.appContainer}>
			<div className={styles.dashboard}>
				<ProfileSidebar me={me} />

			</div>
		</div>
    </div>
  );
}

export default App;
