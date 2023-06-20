import {
  CSSProperties,
  forwardRef,
  HTMLAttributes,
  RefAttributes,
} from 'react';
import classNames from 'classnames/bind';
import _styles from './Flex.module.scss';
const styles = classNames.bind(_styles);

export type FlexItemProps = HTMLAttributes<HTMLDivElement> & {
  fixedWidth?: boolean;
  fixedHeight?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;

  alignSelf?: CSSProperties['alignSelf'];
  flex?:
    | CSSProperties['flex']
    | { shrink?: number; grow?: number; basis?: number | string };
};
export type FlexRowColProps = FlexItemProps & {
  reverse?: boolean;
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  gap?: number | [colGap: number, rowGap?: number];
  wrap?: boolean | CSSProperties['flexWrap'];
};
export type FlexProps = FlexRowColProps & {
  row?: boolean;
  col?: boolean;
  item?: boolean;
};

const Flex = forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      fixedWidth = false,
      fixedHeight = false,
      fullWidth = false,
      fullHeight = false,
      align: alignItems,
      flex,
      justify,
      gap,
      alignSelf,
      reverse = false,
      wrap = false,
      item = false,
      row = true,
      col = false,
      ...props
    },
    ref
  ): JSX.Element => {
    const [columnGap, rowGap] = Array.isArray(gap) ? gap : [gap, gap];
    const flex1 = flex === 1 || flex === '1';
    const flex0 = flex === 0 || flex === '0';
    const flexStyle =
      typeof flex === 'object'
        ? {
            flexBasis: flex?.basis,
            flexGrow: flex?.grow,
            flexShrink: flex?.shrink,
          }
        : !(flex0 || flex1)
        ? { flex }
        : {};
    const itemStyle = {
      ...flexStyle,
      columnGap,
      rowGap,
      // TODO: move alignment styles into scss
      alignItems,
      alignSelf,
      justifyContent: justify,
    };
    const wrapClassName =
      typeof wrap === 'string' ? wrap : wrap ? 'wrap' : 'nowrap';
    props.style = { ...itemStyle, ...props.style };
    props.className = styles(props.className, {
      displayFlex: !item,
      row: row && !reverse,
      col: col && !reverse,
      rowReversed: row && reverse,
      colReversed: col && reverse,
      flex1,
      flex0,
      fixedWidth,
      fixedHeight,
      fullWidth,
      fullHeight,
      [wrapClassName]: true,
    });
    return <div ref={ref} {...props} />;
  }
) as unknown as {
  (props: FlexProps & RefAttributes<HTMLDivElement>): JSX.Element;
  Row: typeof Row;
  Col: typeof Col;
  Item: typeof Item;
};

const Row = forwardRef<HTMLDivElement, FlexRowColProps>((props, ref) => (
  <Flex row ref={ref} {...props} />
));
const Col = forwardRef<HTMLDivElement, FlexRowColProps>((props, ref) => (
  <Flex col ref={ref} {...props} />
));
const Item = forwardRef<HTMLDivElement, FlexItemProps>((props, ref) => (
  <Flex item ref={ref} {...props} />
));

Flex.Row = Row;
Flex.Col = Col;
Flex.Item = Item;

export default Flex;
