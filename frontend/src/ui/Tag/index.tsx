import classNames from 'classnames';
import { HTMLAttributes } from 'react';
import styles from './Tag.module.scss';
import { CloseOutlined } from '@ant-design/icons';

export const Tag = ({
  className,
  danger,
  closable,
  onClose,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  danger?: boolean;
  closable?: boolean;
  onClose?: () => void;
}): JSX.Element => {
  return (
    <div
      className={classNames(styles.tag, { [styles.danger]: danger }, className)}
      {...props}
    >
      {props.children}
      {closable && (
        <CloseOutlined className={styles.closeIcon} onClick={onClose} />
      )}
    </div>
  );
};
