import { useEffect, useState } from "react";
import { Me, PageType } from './types';
import styles from "./App.module.css";
import ProfileSidebar from "./components/ProfileSidebar/ProfileSidebar";
import ApplicationHeader from "./components/ApplicationHeader/ApplicationHeader";
import ApplicationNavigation from "./components/ApplicationNavigation/ApplicationNavigation";

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('overview');
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  const redirectToLogin = () => {
	window.location.href = "http://localhost:4000/login";
  }

  const onLogout = () => {
	fetch('http://localhost:4000/logout', {
		method: 'POST'
	})
		.finally(() => setMe(null));
  };

  const onPageChange = (newPage: PageType) => {
	if (newPage !== currentPage) {
		setCurrentPage(newPage);
	}
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
			<ApplicationHeader characterName={me.characterName} onLogout={onLogout} />
			<ApplicationNavigation currentPage={currentPage} onPageChange={onPageChange} />
		</div>
    </div>
  );
}

export default App;
