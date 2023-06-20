import Flex from 'ui/Flex';
import styles from './Header.module.scss';

export const Header = (): JSX.Element => {
	return (
		<Flex.Row
			className={styles.header}
			fixedHeight
			fullWidth
		>
		</Flex.Row>
	);
};
