import classNames from 'classnames/bind';
import { createContext, HTMLAttributes, useContext } from 'react';
import _styles from './Typography.module.scss';
const styles = classNames.bind(_styles);

const invertContext = createContext(false);
export const useInvertContext = (): boolean => useContext(invertContext);
export const InvertContext = ({
  invert = false,
  ...props
}: Omit<Parameters<typeof invertContext.Provider>[0], 'value'> & {
  invert?: boolean;
}): JSX.Element => <invertContext.Provider {...props} value={invert} />;

export type TitleProps = HTMLAttributes<HTMLDivElement> & {
  level?: 1 | 2 | 3;
  type?: 'default' | 'secondary' | 'gradient';
  invert?: boolean;
  danger?: boolean;
  disableUserSelect?: boolean;
  currentColor?: boolean;
  ellipsis?: boolean;
  bold?: boolean;
  center?: boolean;
  wrap?: 'noWrap' | 'breakSpaces';
};

export const Title = ({
  className,
  level = 2,
  invert: _invert,
  type = 'default',
  danger = false,
  disableUserSelect: userSelectNone = false,
  currentColor = false,
  ellipsis = false,
  wrap = 'noWrap',
  bold = true,
  center = false,
  ...props
}: TitleProps): JSX.Element => {
  const invert = _invert ?? useInvertContext();
  return (
    <div
      className={styles(
        'title',
        type,
        wrap,
        {
          bold,
          center,
          ellipsis,
          invert,
          danger,
          userSelectNone,
          currentColor,
        },
        `titleFontSize${level}`,
        className
      )}
      {...props}
    />
  );
};

export type TextProps = HTMLAttributes<HTMLDivElement> & {
  size?: 1 | 2 | 3 | 4;
  type?:
    | 'default'
    | 'thirdly'
    | 'secondary'
    | 'gradient'
    | 'initial'
    | 'currentColor'
    | 'link';
  invert?: boolean;
  bold?: boolean;
  center?: boolean;
  danger?: boolean;
  disableUserSelect?: boolean;
  currentColor?: boolean;
  ellipsis?: boolean;
  wrap?: 'noWrap' | 'breakSpaces';
};

export const Text = ({
  className,
  size = 1,
  invert: _invert,
  type = 'default',
  bold = false,
  danger = false,
  disableUserSelect: userSelectNone = false,
  currentColor = false,
  ellipsis = false,
  center = false,
  wrap = 'noWrap',
  ...props
}: TextProps): JSX.Element => {
  const invert = _invert ?? useInvertContext();
  return (
    <span
      className={styles(
        'text',
        wrap,
        `textFontSize${size}`,
        {
          [type]: type !== 'initial',
          center,
          invert,
          ellipsis,
          danger,
          bold,
          userSelectNone,
          currentColor,
        },
        className
      )}
      {...props}
    />
  );
};
