import Flex from 'ui/Flex';
import styles from './BiomesEditorHeader.module.scss';

export const BiomesEditorHeader = () => {
    return (
        <Flex.Row justify='center' align='center' gap={8} className={styles.settingsLegend}>
            <Flex.Col flex={1} gap={4}>
                <Flex.Row justify='center'>Height</Flex.Row>
                <Flex.Row justify='center' align='center'>
                    <Flex.Col flex={1}>from</Flex.Col>
                    <Flex.Col flex={1}>to</Flex.Col>
                </Flex.Row>
            </Flex.Col>
            <Flex.Col flex={1} gap={4}>
                <Flex.Row justify='center'>Temperature</Flex.Row>
                <Flex.Row justify='center' align='center'>
                    <Flex.Col flex={1}>from</Flex.Col>
                    <Flex.Col flex={1}>to</Flex.Col>
                </Flex.Row>
            </Flex.Col>
            <Flex.Col flex={1} gap={4}>
                <Flex.Row justify='center'>Moisture</Flex.Row>
                <Flex.Row justify='center' align='center'>
                    <Flex.Col flex={1}>from</Flex.Col>
                    <Flex.Col flex={1}>to</Flex.Col>
                </Flex.Row>
            </Flex.Col>
        </Flex.Row>
    );
};
