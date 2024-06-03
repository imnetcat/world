import { EditOutlined, ExperimentOutlined, EyeOutlined, SaveOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import Flex from 'ui/Flex';
import styles from './Sidebar.module.scss';

export type SidebarOptions = 'generator' | 'inspector' | 'editor' | 'saves';

export interface SidebarProps {
	value?: SidebarOptions;
	onChange?: (value: SidebarOptions) => void;
}

export const Sidebar = ({ value, onChange }: SidebarProps): JSX.Element => {
	return (
		<Flex.Col fixedWidth fullHeight className={styles.sidebar}>
			<Menu selectedKeys={[value as string]} onClick={e => onChange?.(e.key as SidebarOptions)}>
				<Menu.Item key='generator' icon={<ExperimentOutlined />}>Generator</Menu.Item>
				<Menu.Divider />
				<Menu.Item key='saves' icon={<SaveOutlined />}>Saves</Menu.Item>
				<Menu.Item key='inspector' disabled icon={<EyeOutlined />}>Inspector</Menu.Item>
				<Menu.Item key='editor' disabled icon={<EditOutlined />}>Editor</Menu.Item>
			</Menu>
		</Flex.Col>
	);
};
