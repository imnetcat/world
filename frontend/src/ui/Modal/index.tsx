import { CloseOutlined } from '@ant-design/icons';
import { Modal as AntModal } from 'antd';
import classNames from 'classnames';
import styles from './Modal.module.scss';

export type ModalProps = React.ComponentProps<typeof AntModal>;

export const Modal = ({ wrapClassName, ...props }: ModalProps): JSX.Element => (
  <AntModal
    width={720}
    centered
    className={styles.background}
    wrapClassName={classNames(styles.modal, wrapClassName)}
    footer={null}
    closeIcon={<CloseOutlined />}
    {...props}
  />
);
