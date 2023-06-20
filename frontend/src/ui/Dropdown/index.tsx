import { Dropdown as AntDropDown, DropDownProps } from 'antd';
import { HTMLAttributes } from 'react';
import styles from './Dropdown.module.scss';

export const Dropdown = (
  props: DropDownProps & HTMLAttributes<HTMLDivElement>
): JSX.Element => {
  return <AntDropDown {...props} overlayClassName={styles.dropdownMenu} />;
};
