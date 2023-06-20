import classNames from 'classnames/bind';
import { HTMLAttributes } from 'react';
import _styles from './IconWrapper.module.scss';
const styles = classNames.bind(_styles);

export type IconWrapperProps = HTMLAttributes<HTMLDivElement> & {
  type?: 'default' | 'filled' | 'white' | 'secondary' | 'violet' | 'hint';
  size?: 1 | 2 | 3 | 4 | 5 | 6;
  danger?: boolean;
  pointer?: boolean;
  disabled?: boolean;
};

export const IconWrapper = ({
  className,
  type = 'default',
  size = 2,
  danger = false,
  pointer = false,
  disabled = false,
  ...props
}: IconWrapperProps): JSX.Element => (
  <div
    className={styles(
      'box',
      type,
      { danger, pointer, disabled },
      `size${size}`,
      className
    )}
    {...props}
  />
);
