import { Pagination, Table } from 'antd';
import { MetaAPI, QueryParams } from 'api/metaApi';
import { WorldListItem } from 'api/world';
import { useDeleteWorldSaveMutation, useGetWorldsQuery } from 'app/hooks';
import MainLayout from 'components/MainLayout';
import Window from 'components/Window';
import { format } from 'date-fns';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'ui/Button';
import Flex from 'ui/Flex';
import { ScrollBox } from 'ui/Scrollbox';
import styles from './Saves.module.scss';

const SavesPage = () => {
	const history = useHistory();
	const metacom = MetaAPI.getInstance();
	const [deleteWorld] = useDeleteWorldSaveMutation();
	const [savesPagging, setSavesPagging] = useState<{
		offset: number;
		limit: number;
		orderBy: QueryParams['orderBy'];
	}>({
		offset: 0,
		limit: 5,
		orderBy: [{ field: 'createdAt', order: 'descend' }]
	});

	const { data: saves, isLoading: savesLoading } = useGetWorldsQuery({
		...savesPagging
	});

	return (
		<MainLayout sidebarActiveOption='saves'>
			<Flex.Row fullHeight fullWidth gap={32}>
				<ScrollBox containerStyle={{
					height: '100%',
					width: '100%',
					flex: 1,
					minHeight: 0,
				}}>
					<Flex.Col fullWidth gap={32} style={{ margin: '32px 0', height: 'fit-content' }}>
						<Window title='Saves' className={styles.window}>
							<ScrollBox containerStyle={{
								height: '100%',
								flex: 1,
								minHeight: 0,
							}}>
								<Table<WorldListItem>
									dataSource={saves?.data}
									loading={savesLoading}
									columns={[
										{
											title: 'ID',
											dataIndex: 'id',
											key: 'id',
											width: 50,
										},
										{
											title: 'Name',
											dataIndex: 'name',
											key: 'name',
											width: 150,
										},
										{
											title: 'Seed',
											key: 'seed',
											render: (_, { generatorConfig }) => <>{generatorConfig.seed}</>,
											width: 150,
										},
										{
											title: 'Size (in tiles)',
											dataIndex: 'size',
											key: 'size',
											render: (_, { height, width }) => <>{`${height}x${width}`}</>,
											width: 75,
										},
										{
											title: 'Created',
											dataIndex: 'createdAt',
											key: 'createdAt',
											render: (date) => <>{format(new Date(date), 'yyyy/MM/dd p')}</>,
											width: 100,
										},
										{
											title: 'Generation time',
											dataIndex: 'generationTime',
											key: 'generationTime',
											render: (time) => <>{time / 1000}{' sec'}</>,
											width: 75,
										},
										{
											title: 'Action',
											key: 'action',
											width: 50,
											render: (_, { id }) => (
												<Flex.Row justify='center' align='center' gap={16}>
													<Flex.Col>
														<Button
															type='primary'
															onClick={() => history.push(`/inspector/${id}`)}
														>
															Inspect
														</Button>
													</Flex.Col>
													<Flex.Col>
														<Button
															type='default'
															onClick={() => history.push(`/editor/${id}`)}
														>
															Edit
														</Button>
													</Flex.Col>
													<Flex.Col>
														<Button
															onClick={() => deleteWorld({ id })}
															danger
															type='primary'
														>
															Delete
														</Button>
													</Flex.Col>
												</Flex.Row>
											),
										},
									]}
									pagination={false}
								/>
							</ScrollBox>
							<Pagination
								style={{ marginTop: 8 }}
								defaultCurrent={1}
								total={saves?.total}
								onChange={offset => setSavesPagging({
									...savesPagging,
									offset: offset * savesPagging.limit
								})}
							/>
						</Window>
					</Flex.Col>
				</ScrollBox>
			</Flex.Row >
		</MainLayout >
	);
};

export default SavesPage;
