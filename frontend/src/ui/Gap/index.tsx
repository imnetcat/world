import classNames from 'classnames/bind';
import { HTMLAttributes } from 'react';
import _styles from './Gap.module.scss';
const styles = classNames.bind(_styles);

export type GapProps = HTMLAttributes<HTMLDivElement> & {
  size?: 1 | 2 | 3 | 4 | 5 | 6;
  type?: 'vertical' | 'horizontal';
};

export const Gap = ({
  className,
  size = 1,
  type = 'vertical',
  ...props
}: GapProps): JSX.Element => (
  <div className={styles(`${type}Margin${size}`, className)} {...props} />
);
