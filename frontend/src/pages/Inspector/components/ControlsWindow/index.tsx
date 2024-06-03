import { Button } from 'antd';
import Window from 'components/Window';
import { useHistory } from 'react-router-dom';
import Flex from 'ui/Flex';
import styles from './ControlsWindow.module.scss';

interface ControlsWindowProps {
    id: string;
}

export const ControlsWindow = ({ id }: ControlsWindowProps) => {
    const history = useHistory();
    return (
        <Window title='Controls' style={{
            height: 'min-content',
        }} className={styles.window}>
            <Flex.Row fullWidth gap={16} justify='center'>
                <Flex.Col>
                    <Button type='primary'>
                        Download world file
                    </Button>
                </Flex.Col>
                <Flex.Col>
                    <Button type='primary'>
                        Download world image
                    </Button>
                </Flex.Col>
                <Flex.Col>
                    <Button
                        type='primary'
                        onClick={() => history.push(`/editor/${id}`)}
                    >
                        Open in Editor
                    </Button>
                </Flex.Col>
            </Flex.Row>
        </Window>
    );
};
