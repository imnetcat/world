import { CloseOutlined, PlusOutlined, RedoOutlined } from '@ant-design/icons';
import { Collapse, Form, Input, Slider } from 'antd';
import { WorldBase } from 'api/world';
import { useGenerateWorldMutation } from 'app/hooks';
import { Loader } from 'components/Loader';
import MainLayout from 'components/MainLayout';
import Window from 'components/Window';
import { useState } from 'react';
import { useHistory } from "react-router-dom";
import { Button } from 'ui/Button';
import Flex from 'ui/Flex';
import { Text } from 'ui/Typography';
import { seed } from 'utils/seed';
import styles from './Generator.module.scss';

const DEFAULT_GENERATOR_CONFIG: WorldBase = {
	name: 'Untitled',
	height: 1440,
	width: 2560,
	generatorConfig: {
		seed: seed(),
		sharpness: 0.5,
		fudgeFactor: 1.25,
		temperature: 0,
		terrainAmplitudes: [0.5, 0.33, 0.16, 0.75, 0.5, 0.33],
		moistureAmplitudes: [0.16, 0.33, 0.75, 0.33, 0.5, 0.7],
		temperatureAmplitudes: [0.5, 0.33, 0.16, 0.75, 0.5, 0.33],
	},
};

const GeneratorPage = () => {
	const history = useHistory();
	const [form] = Form.useForm<WorldBase>();
	const [loading, setLoading] = useState<boolean>(false);
	const [generateWorld] = useGenerateWorldMutation();

	if (loading) {
		return (
			<MainLayout sidebarActiveOption='generator'>
				<Loader size='large' />
			</MainLayout>
		);
	}

	return (
		<MainLayout sidebarActiveOption='generator'>

			<Flex.Row gap={32} align='center' justify='center' style={{ margin: 32 }}>
				<Flex.Col gap={32} align='center' justify='center'>
					<Window title='Generator' className={styles.window}>
						<Form<WorldBase>
							form={form}
							initialValues={DEFAULT_GENERATOR_CONFIG}
							style={{ height: '100%' }}
							onFinish={async (fields) => {
								setLoading(true);
								generateWorld({
									...fields,
									generatorConfig: {
										...fields.generatorConfig,
										terrainAmplitudes: fields.generatorConfig.terrainAmplitudes.map(a => Number(a)),
										moistureAmplitudes: fields.generatorConfig.moistureAmplitudes.map(a => Number(a)),
										temperatureAmplitudes: fields.generatorConfig.temperatureAmplitudes.map(a => Number(a)),
									}
								});
								setTimeout(() => {
									history.push('/saves');
								}, 6000);
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
														seed()
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
								<Collapse
									bordered={false}
									defaultActiveKey={[]}
								>
									<Collapse.Panel header='Advanced settings' key='1'>
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
									</Collapse.Panel>
								</Collapse>
								<Flex.Row flex={1} fullWidth />
								<Flex.Row flex={0} fullWidth justify='center' gap={16}>
									<Flex.Col>
										<Form.Item noStyle>
											<Button type='primary' htmlType='submit'>Generate</Button>
										</Form.Item>
									</Flex.Col>
								</Flex.Row>
							</Flex.Col>
						</Form>
					</Window>
				</Flex.Col>
			</Flex.Row>
		</MainLayout >
	);
};

export default GeneratorPage;
