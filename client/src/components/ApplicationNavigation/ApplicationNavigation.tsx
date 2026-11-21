import { PageType } from '../../types';
import styles from './ApplicationNavigation.module.css';

type ApplicationNavigationProps = {
	currentPage: PageType;
	onPageChange: (pageType: PageType) => void
};

type NavigationEntry = {
	type: PageType;
	name: string;
}

const pages: NavigationEntry[] = [
	{type: 'overview', name: 'Overview'},
	{type: 'skills', name: 'Skills'},
	{type: 'industry', name: 'Industry'},
	{type: 'fittings', name: 'Fittings'},
	{type: 'assets', name: 'Assets'},
	{type: 'wallet', name: 'Wallet'},
	{type: 'contracts', name: 'Contracts'},
	{type: 'market', name: 'Market'},
	{type: 'mail', name: 'Mail'},
];
function ApplicationNavigation({ currentPage, onPageChange }: ApplicationNavigationProps) {
	return (
		<nav className={styles.applicationNavigation}>
			{pages.map(page => (
				<button
					key={page.type}
					aria-current={page.type === currentPage ? 'page' : undefined}
					onClick={() => onPageChange(page.type)}
				>{page.name}</button>
			))}
		</nav>
	)
}

export default ApplicationNavigation;