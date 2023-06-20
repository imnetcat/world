import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import styles from './Loader.module.scss';

export interface LoaderProps {
	mode?: 'default';
	size?: 'small' | 'default' | 'large';
	className?: string;
}

export const Loader = ({
	mode = 'default',
	size,
	className,
}: LoaderProps): JSX.Element => {
	return (
		<div className={`${styles[mode]} ${className}`}>
			<Spin
				size={size}
				indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
			/>
		</div>
	);
};
