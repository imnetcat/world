import { Button as AntButton, ButtonProps } from 'antd';
import { useState } from 'react';

export const Button = ({
  children,
  type,
  ghost,
  ...props
}: ButtonProps): JSX.Element => {
  const [hover, setHover] = useState(false);
  const _ghost = type === 'primary' ? !hover : ghost && !hover;
  const _type = hover && type !== 'text' ? 'primary' : type;
  return (
    <AntButton
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...props}
      type={_type}
      ghost={_ghost}
    >
      {children}
    </AntButton>
  );
};
