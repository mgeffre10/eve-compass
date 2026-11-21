import { LogOut } from 'lucide-react';
import styles from './ApplicationHeader.module.css';

type ApplicationHeaderProps = {
	characterName: string;
};

function ApplicationHeader({ characterName }: ApplicationHeaderProps) {
	const logout = () => {};
	
	return (
		<div className={styles.applicationHeader}>
			<div className={styles.logoSection}>
				<span>Image</span>
				<span>Eve Tool</span>
			</div>
			<div className={styles.loginSection}>
				<span>Signed in as: {characterName}</span>
				<button onClick={logout}>
					<LogOut size={16} />
					<span>Log out</span>
				</button>
			</div>
		</div>
	)
}

export default ApplicationHeader;