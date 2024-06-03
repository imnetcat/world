import { Collapse, Form } from 'antd';
import { Biomes } from 'api/world';
import Window from 'components/Window';
import { useState } from 'react';
import Flex from 'ui/Flex';
import { Text, Title } from 'ui/Typography';
import { useDebounceState } from 'utils/useDebounceState';
import { ViewSettings } from '../ViewSettingsWindow';
import styles from './BiomesWindow.module.scss';
import { BiomeDistributionDiogram } from './components/BiomeDistributionDiogram';
import { BiomeEditorWrapper } from './components/BiomeEditor';
import { BiomesEditorHeader } from './components/BiomesEditorHeader';
import { BiomesDenormalized, denormalizeBiomes, normalizeBiomes } from './utils';

interface BiomesWindowProps {
    disabled: boolean;
    mode: ViewSettings['mode'];
    value: Biomes;
    onChange: (data: Biomes) => void;
}

export const BiomesWindow = ({ mode, disabled, value, onChange }: BiomesWindowProps) => {
    const biomes = denormalizeBiomes(value);
    const [delta, setDelta] = useState<BiomesDenormalized>(biomes);
    useDebounceState<BiomesDenormalized>(delta, (biomes) => onChange(normalizeBiomes(biomes)), 500);
    return (
        <Window title='Biomes' className={styles.window}>
            <Flex.Row fullWidth><Title center level={3} style={{ width: '100%' }}>Biomes: {value.length}</Title></Flex.Row>
            <Form<BiomesDenormalized>
                initialValues={biomes}
                style={{ height: '100%' }}
                layout='inline'
                requiredMark={false}
                onValuesChange={(_, fields) => setDelta({ ...biomes, ...fields })}
            >
                <Collapse
                    bordered={false}
                    ghost
                >
                    <Collapse.Panel key='marine' header={<Text size={2}>Marine</Text>}>
                        <Form.List name='marine'>
                            {(fields) => (
                                <Flex.Col fullWidth gap={16} >
                                    <BiomesEditorHeader />
                                    {fields.map(({ key, ...field }) => (
                                        <Form.Item noStyle key={key}{...field} rules={[{ required: true }]}>
                                            <BiomeEditorWrapper
                                                heightRange={[-1, 0]}
                                                temperatureRange={[-1, 1]}
                                                moistureRange={[-1, 1]}
                                                disabled={disabled}
                                            />
                                        </Form.Item>
                                    ))}
                                    <Form.Item noStyle shouldUpdate={(prec, curr) => prec.marine !== curr.marine}>
                                        {({ getFieldValue }) =>
                                            <BiomeDistributionDiogram
                                                mode={mode}
                                                value={getFieldValue('marine')}
                                                heightRange={[-1, 0]}
                                                temperatureRange={[-1, 1]}
                                                moistureRange={[-1, 1]}
                                            />
                                        }
                                    </Form.Item>
                                </Flex.Col>
                            )}
                        </Form.List>
                    </Collapse.Panel>
                    <Collapse.Panel key='polar' header={<Text size={2}>Polar</Text>}>
                        <Form.List name='polar'>
                            {(fields) => (
                                <Flex.Col fullWidth gap={16} >
                                    <BiomesEditorHeader />
                                    {fields.map(({ key, ...field }) => (
                                        <Form.Item noStyle key={key}{...field} rules={[{ required: true }]}>
                                            <BiomeEditorWrapper
                                                heightRange={[0, 1]}
                                                temperatureRange={[-1, -0.3]}
                                                moistureRange={[-1, 1]}
                                                disabled={disabled}
                                            />
                                        </Form.Item>
                                    ))}
                                    <Form.Item noStyle shouldUpdate={(prec, curr) => prec.polar !== curr.polar}>
                                        {({ getFieldValue }) =>
                                            <BiomeDistributionDiogram
                                                mode={mode}
                                                value={getFieldValue('polar')}
                                                heightRange={[0, 1]}
                                                temperatureRange={[-1, -0.3]}
                                                moistureRange={[-1, 1]}
                                            />
                                        }
                                    </Form.Item>
                                </Flex.Col>
                            )}
                        </Form.List>
                    </Collapse.Panel>
                    <Collapse.Panel key='subtropical' header={<Text size={2}>Subtropical</Text>}>
                        <Form.List name='subtropical'>
                            {(fields) => (
                                <Flex.Col fullWidth gap={16} >
                                    <BiomesEditorHeader />
                                    {fields.map(({ key, ...field }) => (
                                        <Form.Item noStyle key={key}{...field} rules={[{ required: true }]}>
                                            <BiomeEditorWrapper
                                                heightRange={[0, 1]}
                                                temperatureRange={[-0.3, 0.5]}
                                                moistureRange={[-1, 1]}
                                                disabled={disabled}
                                            />
                                        </Form.Item>
                                    ))}
                                    <Form.Item noStyle shouldUpdate={(prec, curr) => prec.subtropical !== curr.subtropical}>
                                        {({ getFieldValue }) =>
                                            <BiomeDistributionDiogram
                                                mode={mode}
                                                value={getFieldValue('subtropical')}
                                                heightRange={[0, 1]}
                                                temperatureRange={[-0.3, 0.5]}
                                                moistureRange={[-1, 1]}
                                            />
                                        }
                                    </Form.Item>
                                </Flex.Col>
                            )}
                        </Form.List>
                    </Collapse.Panel>
                    <Collapse.Panel key='tropical' header={<Text size={2}>Tropical</Text>}>
                        <Form.List name='tropical'>
                            {(fields) => (
                                <Flex.Col fullWidth gap={16} >
                                    <BiomesEditorHeader />
                                    {fields.map(({ key, ...field }) => (
                                        <Form.Item noStyle key={key} {...field} rules={[{ required: true }]}>
                                            <BiomeEditorWrapper
                                                heightRange={[0, 1]}
                                                temperatureRange={[0.5, 1]}
                                                moistureRange={[-1, 1]}
                                                disabled={disabled}
                                            />
                                        </Form.Item>
                                    ))}
                                    <Form.Item noStyle shouldUpdate={(prec, curr) => prec.tropical !== curr.tropical}>
                                        {({ getFieldValue }) =>
                                            <BiomeDistributionDiogram
                                                mode={mode}
                                                value={getFieldValue('tropical')}
                                                heightRange={[0, 1]}
                                                temperatureRange={[0.5, 1]}
                                                moistureRange={[-1, 1]}
                                            />
                                        }
                                    </Form.Item>
                                </Flex.Col>
                            )}
                        </Form.List>
                    </Collapse.Panel>
                    <Collapse.Panel key='generic' header={<Text size={2}>Generic</Text>}>
                        <Form.List name='generic'>
                            {(fields) => (
                                <Flex.Col fullWidth gap={16} >
                                    <BiomesEditorHeader />
                                    {fields.map(({ key, ...field }) => (
                                        <Form.Item noStyle key={key} {...field} rules={[{ required: true }]}>
                                            <BiomeEditorWrapper
                                                heightRange={[-1, 1]}
                                                temperatureRange={[-1, 1]}
                                                moistureRange={[-1, 1]}
                                                disabled={disabled}
                                            />
                                        </Form.Item>
                                    ))}
                                    <Form.Item noStyle shouldUpdate={(prec, curr) => prec.generic !== curr.generic}>
                                        {({ getFieldValue }) =>
                                            <BiomeDistributionDiogram
                                                mode={mode}
                                                value={getFieldValue('generic')}
                                                heightRange={[-1, 1]}
                                                temperatureRange={[-1, 1]}
                                                moistureRange={[-1, 1]}
                                            />
                                        }
                                    </Form.Item>
                                </Flex.Col>
                            )}
                        </Form.List>

                    </Collapse.Panel>
                </Collapse>
            </Form>
        </Window>
    );
};
