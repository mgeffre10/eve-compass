import { Compass, LogOut } from 'lucide-react';
import styles from './ApplicationHeader.module.css';

type ApplicationHeaderProps = {
	characterName: string;
	onLogout: () => void;
};

function ApplicationHeader({ characterName, onLogout }: ApplicationHeaderProps) {	
	return (
		<div className={styles.applicationHeader}>
			<div className={styles.logoSection}>
				<Compass size={36} />
				<span>EVE Compass</span>
			</div>
			<div className={styles.loginSection}>
				<span>Signed in as: {characterName}</span>
				<button onClick={onLogout}>
					<LogOut size={16} />
					<span>Log out</span>
				</button>
			</div>
		</div>
	)
}

export default ApplicationHeader;