import { GlobalOutlined, HomeOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import Flex from 'ui/Flex';
import styles from './Sidebar.module.scss';

export type SidebarOptions = 'settings' | 'home' | 'world';

export interface SidebarProps {
	value?: SidebarOptions;
	onChange?: (value: SidebarOptions) => void;
}

export const Sidebar = ({ value, onChange }: SidebarProps): JSX.Element => {
	return (
		<Flex.Col fixedWidth fullHeight className={styles.sidebar}>
			<Menu selectedKeys={[value as string]} onClick={e => onChange?.(e.key as SidebarOptions)}>
				<Menu.Item key='home' icon={<HomeOutlined />}>Home</Menu.Item>
				<Menu.Item key='world' icon={<GlobalOutlined />}>World</Menu.Item>
				<Menu.Divider />
				<Menu.Item key='settings' icon={<SettingOutlined />}>Settings</Menu.Item>
			</Menu>
		</Flex.Col>
	);
};
