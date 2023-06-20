import { Button, Col, Modal, Row, Typography } from 'antd';
import styles from './Popup.module.scss';

const { Title } = Typography;

interface PopupProps {
	title: string;
	okBtn: JSX.Element;
	onCancel: () => void;
	isVisible: boolean;
	children: JSX.Element[] | JSX.Element;
	className?: string;
	cancelBtnText?: string;
	width?: string;
}

const Popup = ({
	title,
	isVisible,
	okBtn,
	onCancel,
	children,
	className,
	cancelBtnText = 'Cancel',
	width,
}: PopupProps): JSX.Element => {
	return (
		<Modal
			visible={isVisible}
			title={<Title level={4}>{title}</Title>}
			className={className}
			onCancel={onCancel}
			width={width}
			centered
			footer={
				<Row gutter={24}>
					<Col flex={1} />
					<Col>
						<Button
							type="text"
							onClick={onCancel}
							className={styles.buttons}
						>
							{cancelBtnText}
						</Button>
					</Col>
					<Col className={styles.okBtnContainer}>{okBtn}</Col>
				</Row>
			}
		>
			{children}
		</Modal>
	);
};

export default Popup;
