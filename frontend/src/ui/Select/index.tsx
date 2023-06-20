import { Select as AntSelect, SelectProps } from 'antd';
import { Divider } from 'ui/Divider';
import Flex from 'ui/Flex';
import { Gap } from 'ui/Gap';
import { IconWrapper } from 'ui/IconWrapper';
import { Text } from 'ui/Typography';
import styles from './Select.module.scss';

export interface OptionsType<T extends string> {
  label: string;
  value: T;
  icon?: JSX.Element;
}

export interface SelectPropsEx<T extends string>
  extends Omit<SelectProps<T>, 'options' | 'children'> {
  title?: string;
  options: Array<OptionsType<T>>;
}

export const Select = <T extends string>({
  title,
  options,
  ...props
}: SelectPropsEx<T>) => (
  <AntSelect<T>
    {...props}
    dropdownRender={(menu) => (
      <Flex.Col className={styles.select}>
        {title && (
          <>
            <Text size={2} type="secondary" className={styles.title}>
              {title}
            </Text>
            <Gap size={1} />
            <Divider />
            <Gap size={1} />
          </>
        )}
        {menu}
      </Flex.Col>
    )}
  >
    {options.map(({ value, label, icon }) => (
      <AntSelect.Option key={value} value={value}>
        <Flex.Row align="center" gap={8}>
          {icon && (
            <Flex.Col>
              <IconWrapper size={3}>{icon}</IconWrapper>
            </Flex.Col>
          )}
          <Flex.Col>{label}</Flex.Col>
        </Flex.Row>
      </AntSelect.Option>
    ))}
  </AntSelect>
);
