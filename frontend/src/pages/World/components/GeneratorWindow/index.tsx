import { CloseOutlined, PlusOutlined, RedoOutlined } from '@ant-design/icons';
import { Form, Input, Slider } from 'antd';
import { MetaAPI } from 'api/metaApi';
import { World, WorldBase } from 'api/world';
import Window from 'components/Window';
import { Button } from 'ui/Button';
import Flex from 'ui/Flex';
import { Text } from 'ui/Typography';
import { generateRandomSeed } from '../../utils';
import styles from './GeneratorWindow.module.scss';

interface GeneratorWindowProps {
    value: WorldBase;
    hasWorld: boolean;
    onChange: (data: { loading: true } | { loading: false, world: World, time: number }) => void;
    onUseFromLoadedWorld: (setter: (value: WorldBase) => void) => void;
}

export const GeneratorWindow = ({ value, onChange, hasWorld, onUseFromLoadedWorld }: GeneratorWindowProps) => {
    const metacom = MetaAPI.getInstance();
    const [form] = Form.useForm<WorldBase>();
    return (
        <Window title='Generator' className={styles.window}>
            <Form<WorldBase>
                form={form}
                initialValues={value}
                style={{ height: '100%' }}
                onFinish={async (fields) => {
                    onChange({ loading: true });
                    const config = {
                        ...fields,
                        generatorConfig: {
                            ...fields.generatorConfig,
                            terrainAmplitudes: fields.generatorConfig.terrainAmplitudes.map(a => Number(a)),
                            moistureAmplitudes: fields.generatorConfig.moistureAmplitudes.map(a => Number(a)),
                            temperatureAmplitudes: fields.generatorConfig.temperatureAmplitudes.map(a => Number(a)),
                        }
                    };
                    const { data, time } = await metacom.call('world', 'generate', config);
                    onChange({ loading: false, time: new Date().getTime() - time, world: data });
                }}
                layout='inline'
                requiredMark={false}
            >
                <Flex.Col fullHeight fullWidth wrap gap={16}>
                    <Flex.Row flex={0} fullWidth gap={16}>
                        <Form.Item noStyle name='name' rules={[{ required: true }]}>
                            <Input prefix='Name:' />
                        </Form.Item>
                    </Flex.Row>
                    <Flex.Row flex={0} fullWidth gap={16}>
                        <Form.Item noStyle name={['generatorConfig', 'seed']} rules={[{ required: true }]}>
                            <Input
                                prefix='Seed:'
                                suffix={<Button
                                    type='text'
                                    onClick={() => {
                                        form.setFieldValue(
                                            ['generatorConfig', 'seed'],
                                            generateRandomSeed()
                                        );
                                    }} icon={<RedoOutlined />} />}
                            />
                        </Form.Item>
                    </Flex.Row>
                    <Flex.Row flex={0} fullWidth gap={16}>
                        <Flex.Col flex={1}>
                            <Form.Item noStyle name='height' rules={[{ required: true }]}>
                                <Input prefix='Height (in tiles):' type='number' />
                            </Form.Item>
                        </Flex.Col>
                        <Flex.Col flex={1}>
                            <Form.Item noStyle name='width' rules={[{ required: true }]}>
                                <Input prefix='Width (in tiles):' type='number' />
                            </Form.Item>
                        </Flex.Col>
                    </Flex.Row>
                    <Flex.Row flex={0} fullWidth gap={16} align='center'>
                        <Flex.Col flex={1}>
                            <Form.Item style={{ margin: 0 }} label='Temperature:' name={['generatorConfig', 'temperature']} rules={[{ required: true }]}>
                                <Slider
                                    min={-1}
                                    max={1}
                                    step={0.1}
                                    tooltip={{ formatter: (value) => `${value}` }}
                                />
                            </Form.Item>
                        </Flex.Col>
                        <Flex.Col flex={1}>
                        </Flex.Col>
                    </Flex.Row>
                    <Flex.Row flex={0} fullWidth gap={16} align='center'>
                        <Flex.Col flex={1}>
                            <Form.Item style={{ margin: 0 }} label='Fudge factor:' name={['generatorConfig', 'fudgeFactor']} rules={[{ required: true }]}>
                                <Slider
                                    min={0.5}
                                    max={1.5}
                                    step={0.05}
                                    tooltip={{ formatter: (value) => `${value}` }}
                                />
                            </Form.Item>
                        </Flex.Col>
                        <Flex.Col flex={1}>
                            <Form.Item style={{ margin: 0 }} label='Sharpness:' name={['generatorConfig', 'sharpness']} rules={[{ required: true }]}>
                                <Slider
                                    min={0.05}
                                    max={2}
                                    step={0.05}
                                    tooltip={{ formatter: (value) => `${value}` }}
                                />
                            </Form.Item>
                        </Flex.Col>
                    </Flex.Row>
                    <Flex.Row flex={0} fullWidth gap={16} justify='center'>
                        <Flex.Col flex={1}>
                            <Form.List name={['generatorConfig', 'terrainAmplitudes']}>
                                {(fields, { add, remove }) => (
                                    <Flex.Col gap={16} fullWidth justify='center' align='center'>
                                        <Text size={2}>Terrain amplitudes:</Text>
                                        {fields.map(({ key, ...field }, i) => (
                                            <Flex.Row fullWidth key={key} gap={16} align='center' justify='center'>
                                                <Flex.Col>
                                                    <Form.Item {...field} noStyle rules={[{ required: true }]}>
                                                        <Input
                                                            min={0.01}
                                                            max={1}
                                                            step={0.01}
                                                            type='number'
                                                        />
                                                    </Form.Item>
                                                </Flex.Col>
                                                <Flex.Col>
                                                    <Button onClick={() => remove(field.name)} type='text' icon={<CloseOutlined />} />
                                                </Flex.Col>
                                            </Flex.Row>
                                        ))}
                                        <Button
                                            onClick={() => add(1)}
                                            type='text'
                                            icon={<PlusOutlined />}
                                        >
                                            Add layer
                                        </Button>
                                    </Flex.Col>
                                )}
                            </Form.List>
                        </Flex.Col>
                        <Flex.Col flex={1}>
                            <Form.List name={['generatorConfig', 'moistureAmplitudes']}>
                                {(fields, { add, remove }) => (
                                    <Flex.Col fullWidth gap={16} justify='center' align='center'>
                                        <Text size={2}>Moisture amplitudes:</Text>
                                        {fields.map(({ key, ...field }, i) => (
                                            <Flex.Row fullWidth key={key} align='center' justify='center'>
                                                <Flex.Col>
                                                    <Form.Item {...field} noStyle rules={[{ required: true }]}>
                                                        <Input
                                                            min={0.01}
                                                            max={1}
                                                            step={0.01}
                                                            type='number'
                                                        />
                                                    </Form.Item>
                                                </Flex.Col>
                                                <Flex.Col>
                                                    <Button onClick={() => remove(field.name)} type='text' icon={<CloseOutlined />} />
                                                </Flex.Col>
                                            </Flex.Row>
                                        ))}
                                        <Button
                                            onClick={() => add(1)}
                                            type='text'
                                            icon={<PlusOutlined />}
                                        >
                                            Add layer
                                        </Button>
                                    </Flex.Col>
                                )}
                            </Form.List>
                        </Flex.Col>
                        <Flex.Col flex={1}>
                            <Form.List name={['generatorConfig', 'temperatureAmplitudes']}>
                                {(fields, { add, remove }) => (
                                    <Flex.Col gap={16} fullWidth justify='center' align='center'>
                                        <Text size={2}>Temperature amplitudes:</Text>
                                        {fields.map(({ key, ...field }, i) => (
                                            <Flex.Row fullWidth key={key} gap={16} justify='center' align='center'>
                                                <Flex.Col>
                                                    <Form.Item {...field} noStyle rules={[{ required: true }]}>
                                                        <Input
                                                            min={0.01}
                                                            max={1}
                                                            step={0.01}
                                                            type='number'
                                                        />
                                                    </Form.Item>
                                                </Flex.Col>
                                                <Flex.Col>
                                                    <Button onClick={() => remove(field.name)} type='text' icon={<CloseOutlined />} />
                                                </Flex.Col>
                                            </Flex.Row>
                                        ))}
                                        <Button
                                            onClick={() => add(1)}
                                            type='text'
                                            icon={<PlusOutlined />}
                                        >
                                            Add layer
                                        </Button>
                                    </Flex.Col>
                                )}
                            </Form.List>
                        </Flex.Col>
                    </Flex.Row>
                    <Flex.Row flex={1} fullWidth />
                    <Flex.Row flex={0} fullWidth justify='center' gap={16}>
                        <Flex.Col><Button disabled={!hasWorld} onClick={() => onUseFromLoadedWorld(form.setFieldsValue)}>Use from loaded World</Button></Flex.Col>
                        <Flex.Col>
                            <Form.Item noStyle>
                                <Button type='primary' htmlType='submit'>Generate</Button>
                            </Form.Item>
                        </Flex.Col>
                    </Flex.Row>
                </Flex.Col>
            </Form>
        </Window>
    );
};
