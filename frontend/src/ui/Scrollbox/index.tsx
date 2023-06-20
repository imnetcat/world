import classNames from 'classnames';
import { HTMLAttributes, useRef, useState } from 'react';
import styles from './Scrollbox.module.scss';

export type ScrollBoxProps = HTMLAttributes<HTMLDivElement> & {
  containerStyle?: HTMLAttributes<HTMLDivElement>['style'];
  containerClassName?: string;
  direction?: 'horizontal' | 'vertical' | 'both';
  showScrollbar?: boolean;
};

/**
 *  Container must have fixed size in direction of scroll, or else there is nothing to scroll into
 */
export const ScrollBox = ({
  containerStyle,
  containerClassName,
  className,
  onScroll,
  direction = 'vertical',
  showScrollbar = false,
  ...props
}: ScrollBoxProps): JSX.Element => {
  const [scrolledToTop, setScrolledToTop] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const recalculateScrolledTo = (el: HTMLDivElement) => {
    const scrolledToTop = el.scrollTop === 0;
    const scrolledToBottom =
      Math.ceil(el.scrollTop) >= el.scrollHeight - el.offsetHeight;

    setScrolledToBottom(scrolledToBottom);
    setScrolledToTop(scrolledToTop);
  };

  // useEffect(() => {
  //   if (!ref.current) return;
  //   if (innerRef.current) recalculateScrolledTo(innerRef.current);
  //   const resizeObserver = new ResizeObserver(() => {
  //     if (innerRef.current) recalculateScrolledTo(innerRef.current);
  //   });
  //   [...ref.current.children].forEach((child) => {
  //     resizeObserver.observe(child);
  //   });
  //   return () => resizeObserver.disconnect();
  // });

  return (
    <div
      ref={ref}
      style={containerStyle}
      className={classNames(containerClassName, styles.scrollBoxContainer, {
        [styles.notTop]: !scrolledToTop,
        [styles.notBottom]: !scrolledToBottom,
      })}
    >
      <div
        ref={innerRef}
        className={classNames(className, styles.scrollBox, {
          [styles.hiddenScrollbar]: !showScrollbar,
          [styles.scrollboxX]: direction !== 'vertical',
          [styles.scrollboxY]: direction !== 'horizontal',
        })}
        onScroll={(e) => {
          const el = e.target as HTMLDivElement;
          recalculateScrolledTo(el);
          onScroll?.(e);
        }}
        {...props}
      />
    </div>
  );
};
