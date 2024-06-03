import { Form, Input, Select, Slider } from 'antd';
import Window from 'components/Window';
import { useState } from 'react';
import Flex from 'ui/Flex';
import { Text } from 'ui/Typography';
import { ViewSettingsMode } from 'utils/types';
import { useDebounceState } from 'utils/useDebounceState';
import styles from './ViewSettingsWindow.module.scss';

export interface ViewSettings {
    tileSize: number;
    mode: ViewSettingsMode;
    offsetX: number;
    offsetY: number;
    zoom: number;
}

const VIEW_SETTINGS_MODE = ['terrain', 'height', 'moisture', 'temperature'];

interface ViewSettingsWindowProps {
    renderTime: number | null;
    loadTime: number | null;
    worldHeight?: number;
    worldWidth?: number;
    viewSettings: ViewSettings;
    setViewSettings: React.Dispatch<React.SetStateAction<ViewSettings>>;
}

export const ViewSettingsWindow = ({ worldHeight, loadTime, worldWidth, renderTime, viewSettings, setViewSettings }: ViewSettingsWindowProps) => {
    const [delta, setDelta] = useState(viewSettings);
    useDebounceState(delta, setViewSettings, 500);
    return (
        <Window title='View Settings' style={{
            height: 'min-content',
        }} className={styles.window}>
            <Form<ViewSettings>
                style={{ width: '100%' }}
                layout='inline'
                requiredMark={false}
                initialValues={viewSettings}
                onValuesChange={(_, fields) => {
                    setDelta({
                        ...fields,
                        tileSize: parseInt(fields.tileSize as unknown as string),
                    })
                }}
            >
                <Flex.Col fullHeight fullWidth wrap gap={16}>
                    <Flex.Row flex={0} fullWidth gap={16}>
                        <Flex.Col>
                            <Flex.Row gap={4}>
                                <Text size={2} type='secondary'>Render time:</Text>
                                <Text size={2}>{!renderTime ? '-' : `${renderTime / 1000} sec`}</Text>
                            </Flex.Row>
                        </Flex.Col>
                        <Flex.Col>
                            <Flex.Row gap={4}>
                                <Text size={2} type='secondary'>Load time:</Text>
                                <Text size={2}>{!loadTime ? '-' : `${loadTime / 1000} sec`}</Text>
                            </Flex.Row>
                        </Flex.Col>
                    </Flex.Row>
                    <Flex.Row flex={0} fullWidth gap={16}>
                        <Flex.Col flex={1}>
                            <Form.Item style={{ margin: 0 }} label='Offset X:' name='offsetX' rules={[{ required: true }]}>
                                <Slider
                                    min={0}
                                    max={!worldWidth ? 100 : worldWidth / 2}
                                    step={1}
                                    tooltip={{ formatter: (value) => `${value}` }}
                                />
                            </Form.Item>
                        </Flex.Col>
                        <Flex.Col flex={1}>
                            <Form.Item style={{ margin: 0 }} label='Offset Y:' name='offsetY' rules={[{ required: true }]}>
                                <Slider
                                    min={0}
                                    max={!worldHeight ? 100 : worldHeight / 2}
                                    step={1}
                                    tooltip={{ formatter: (value) => `${value}` }}
                                />
                            </Form.Item>
                        </Flex.Col>
                    </Flex.Row>
                    <Flex.Row flex={0} fullWidth>
                        <Form.Item style={{ margin: 0, width: '100%' }} label='Zoom:' name='zoom' rules={[{ required: true }]}>
                            <Slider
                                min={1}
                                max={10}
                                step={1}
                                tooltip={{ formatter: (value) => `${value}` }}
                            />
                        </Form.Item>
                    </Flex.Row>
                    <Flex.Row flex={0} fullWidth gap={16}>
                        <Flex.Col flex={1}>
                            <Form.Item noStyle name='tileSize' rules={[{ required: true }]}>
                                <Input
                                    min={1}
                                    max={10}
                                    step={1}
                                    prefix='Tile size (in pixels):'
                                    type='number'
                                />
                            </Form.Item>
                        </Flex.Col>
                        <Flex.Col flex={1}>
                            <Form.Item style={{ margin: 0 }} label='View Mode:' name='mode' rules={[{ required: true }]}>
                                <Select options={VIEW_SETTINGS_MODE.map(option => ({ label: option, value: option }))} />
                            </Form.Item>
                        </Flex.Col>
                    </Flex.Row>
                    <Flex.Row flex={1} fullWidth />
                </Flex.Col>
            </Form>
        </Window>
    );
};
