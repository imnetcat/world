import { Divider as AntDivider } from 'antd';
import { DividerProps as AntDividerProps } from 'antd/es';
import classNames from 'classnames/bind';
import _styles from './Divider.module.scss';
const styles = classNames.bind(_styles);

export type DividerProps = AntDividerProps & {
  danger?: boolean;
  verticalMargin?: 0 | 1 | 2 | 3;
  horizontalMargin?: 0 | 1 | 2 | 3;
};

export const Divider = ({
  className,
  danger = false,
  verticalMargin = 0,
  horizontalMargin = 0,
  ...props
}: DividerProps): JSX.Element => (
  <AntDivider
    className={styles(
      'divider',
      `verticalMargin${verticalMargin}`,
      `horizontalMargin${horizontalMargin}`,
      { danger },
      className
    )}
    {...props}
  />
);
