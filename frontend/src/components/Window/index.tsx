import Flex from 'ui/Flex';
import { Text } from 'ui/Typography';
import styles from './Window.module.scss';

interface WindowProps {
	icon?: JSX.Element;
	title?: string;
	children: React.ReactNode;
	style?: React.CSSProperties;
	className?: string;
	childrenStyle?: React.CSSProperties;
}

const Window = ({
	children,
	title,
	icon,
	style,
	className,
	childrenStyle,
}: WindowProps) => {
	return (
		<Flex.Row fullHeight fullWidth wrap='nowrap' className={styles.window} style={style}>
			{title && (
				<Flex.Col fullWidth align='center'>
					<Text
						type="secondary"
						className={styles.header}
					>
						{icon}{' '}{title}
					</Text>
				</Flex.Col>
			)}
			<Flex.Col
				style={childrenStyle}
				className={`${styles.childrenColumn} ${className}`}
			>
				{children}
			</Flex.Col>
		</Flex.Row>
	);
};

export default Window;
