import classNames from 'classnames/bind';
import { HTMLAttributes } from 'react';
import { InvertContext } from 'ui/Typography';
import _styles from './Card.module.scss';
const styles = classNames.bind(_styles);

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  danger?: boolean;
  warning?: boolean;
  hover?: boolean;
  selected?: boolean;
  opened?: boolean;
  disabled?: boolean;
  shadow?: boolean;
  fullHeight?: boolean;
  square?: boolean;
};

export const Card = ({
  className,
  danger = false,
  warning = false,
  hover = false,
  selected = false,
  opened = false,
  disabled = false,
  shadow = false,
  fullHeight = false,
  square = false,
  ...props
}: CardProps): JSX.Element => (
  <InvertContext invert={opened}>
    <div
      className={styles(
        'box',
        {
          danger,
          warning,
          hover,
          selected,
          opened,
          shadow,
          disabled,
          fullHeight,
          square,
        },
        className
      )}
      {...props}
    />
  </InvertContext>
);
