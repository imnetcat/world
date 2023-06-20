import { Header } from 'components/Header';
import { Sidebar, SidebarOptions } from 'components/Sidebar';
import { useHistory } from 'react-router-dom';
import Flex from 'ui/Flex';
import styles from './MainLayout.module.scss';

interface MainLayoutProps {
	children: React.ReactNode;
	sidebarActiveOption?: SidebarOptions;
}

const MainLayout = ({
	children,
	sidebarActiveOption,
}: MainLayoutProps): JSX.Element => {
	const history = useHistory();
	return (
		<>
			<Header />
			<Flex.Row fullWidth className={styles.container}>
				<Sidebar value={sidebarActiveOption} onChange={key => history.push(`/${key}`)} />
				<Flex.Col flex={1} fullHeight fullWidth className={styles.content}>
					{children}
				</Flex.Col>
			</Flex.Row>
		</>
	);
};

export default MainLayout;
