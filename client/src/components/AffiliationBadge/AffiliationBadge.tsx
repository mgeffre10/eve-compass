import LoadingDiv from "../LoadingDiv/LoadingDiv";
import styles from './AffiliationBadge.module.css';

type AffiliationBadgeProps = {
	title: string;
	icon: string | null;
	name: string | null;
	width: number;
	height: number;
};

function AffiliationBadge({ title, icon, name, width, height }: AffiliationBadgeProps) {
	return (
		<div className={styles.affilationBadge}>
			<h3>{title}</h3>
			{icon ? <img src={icon} width={width} height={height} /> : <LoadingDiv width={width} height={height} />}
			<p>{name || 'Unknown'}</p>
		</div>
	);
}

export default AffiliationBadge;