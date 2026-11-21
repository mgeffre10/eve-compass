import useOnlineStatus from '../../hooks/useOnlineStatus';
import styles from './OnlineIndicator.module.css'

type OnlineIndicatorProps = {
	characterID: number;
}
function OnlineIndicator({ characterID }: OnlineIndicatorProps) {
	const onlineStatus = useOnlineStatus(characterID);

	return (
		<div className={styles.onlineIndicator}>
			{onlineStatus ? <span className={`${styles.dot} ${onlineStatus.online ? styles.online : styles.offline}`}></span> : <></>}
		</div>	
	);
}

export default OnlineIndicator;