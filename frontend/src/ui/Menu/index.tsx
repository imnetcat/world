import {
  DividerProps,
  Menu as AntMenu,
  MenuItemProps,
  MenuProps,
  SubMenuProps,
} from 'antd';
import { Fragment } from 'react';
import styles from './Menu.module.scss';

export interface MenuItem extends MenuItemProps {
  key: string;
  item?: () => JSX.Element;
  isDividerBefore?: boolean;
  isDividerAfter?: boolean;
  hidden?: boolean;
}

const Menu = {
  Menu: ({
    overlay,
    children,
    ...props
  }: MenuProps & { overlay?: MenuItem[] }) => (
    <AntMenu {...props} className={styles.menu}>
      {children}
      {overlay?.map(
        ({ isDividerBefore, isDividerAfter, hidden, ...itemProps }) => (
          <Fragment key={`${itemProps.key}-item-container`}>
            {!hidden && !!isDividerBefore && <Menu.Divider />}
            {!hidden && <Menu.Item {...itemProps} />}
            {!hidden && !!isDividerAfter && <Menu.Divider />}
          </Fragment>
        )
      )}
    </AntMenu>
  ),
  Divider: (props: DividerProps) => <AntMenu.Divider {...props} />,
  Item: (props: MenuItemProps) => <AntMenu.Item {...props} />,
  SubMenu: (props: SubMenuProps) => (
    <AntMenu.SubMenu
      {...props}
      className={styles.submenu}
      popupClassName={styles.submenuPopup}
    />
  ),
};

export default Menu;
