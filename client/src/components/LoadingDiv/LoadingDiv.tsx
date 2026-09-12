import styles from './LoadingDiv.module.css';

type LoadingDivProps = {
	width: number;
	height: number;
};

function LoadingDiv({ width, height }: LoadingDivProps) {
	return (
		<div className={styles.loadingDiv} style={{ width, height }}></div>
	);
}

export default LoadingDiv;