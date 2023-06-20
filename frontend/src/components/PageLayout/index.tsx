import styles from './PageLayout.module.scss';

interface PageLayoutProps {
	children: JSX.Element[] | JSX.Element;
}

const PageLayout = ({ children }: PageLayoutProps): JSX.Element => {
	const arrayOfChildren = children as JSX.Element[];
	return (
		<div className={styles.home}>
			{arrayOfChildren.length ? [...arrayOfChildren] : children}
		</div>
	);
};

export default PageLayout;
