import { World } from 'api/world';
import { useGetBiomesQuery, useGetWorldQuery, useSetBiomesMutation } from 'app/hooks';
import { Canvas } from 'components/Canvas';
import { Loader } from 'components/Loader';
import MainLayout from 'components/MainLayout';
import Window from 'components/Window';
import { useCallback, useEffect, useState } from 'react';
import Flex from 'ui/Flex';
import { ScrollBox } from 'ui/Scrollbox';
import { getTileColor } from 'utils/getTileColor';
import { CommonPage } from 'utils/types';
import styles from './Editor.module.scss';
import { BiomesWindow } from './components/BiomesWindow';
import { CellInfoWindow } from './components/CellInfoWindow';
import { InfoWindow } from './components/InfoWindow';
import { ViewSettings, ViewSettingsWindow } from './components/ViewSettingsWindow';

const EditorPage = ({ match: { params: { id } } }: CommonPage) => {
	const { data: world, isLoading: worldLoading } = useGetWorldQuery({ id });
	const { data: biomes, isLoading: biomesLoading } = useGetBiomesQuery({});
	const [setBiomes] = useSetBiomesMutation();
	const [viewSettings, setViewSettings] = useState<ViewSettings>({
		tileSize: 2,
		mode: 'terrain',
		offsetX: 0,
		offsetY: 0,
		zoom: 1,
	});
	const [selectedTile, setSelectedTile] = useState<World['tiles'][number] | null>(null);
	const [renderTime, setRenderTime] = useState<number | null>(null);

	useEffect(() => {
		setSelectedTile(null);
	}, [world]);

	const renderWorldMap = useCallback((context: CanvasRenderingContext2D) => {
		if (!world || !biomes) return;

		const { tiles, width, height } = world.data;
		const { tileSize, mode, offsetX, offsetY, zoom } = viewSettings;
		const renderTimeStart = new Date().getTime();
		context.canvas.width = tileSize * width * zoom;
		context.canvas.height = tileSize * height * zoom;
		context.fillStyle = '#000000';
		context.fillRect(0, 0, context.canvas.width, context.canvas.height);
		context.scale(zoom, zoom);
		for (let i = 0; i < tiles.length; i++) {
			const tile = tiles[i];
			let x = tile.x + offsetX;
			let y = tile.y + offsetY;
			if (x >= width) {
				x -= width;
			}
			if (y >= height) {
				y -= height;
			}
			x *= tileSize;
			y *= tileSize;
			context.fillStyle = getTileColor(tile, biomes.indexed[tile.biome] || '#000000', mode);
			context.fillRect(x, y, tileSize, tileSize);
		}
		const renderTimeEnd = new Date().getTime();
		setRenderTime(renderTimeEnd - renderTimeStart);
	}, [world, viewSettings, biomes]);

	if (!biomes || !world || biomesLoading || worldLoading) {
		return (
			<MainLayout sidebarActiveOption='inspector'>
				<Loader size='large' />
			</MainLayout>
		);
	}

	return (
		<MainLayout sidebarActiveOption='inspector'>
			<Flex.Row fullHeight fullWidth gap={32}>
				<Flex.Col fullHeight style={{ width: '70%' }}>
					<ScrollBox containerStyle={{
						height: '100%',
						width: '100%',
						flex: 1,
						minHeight: 0,
					}}>
						<Flex.Col fullWidth gap={32} style={{ margin: '32px 0', height: 'fit-content' }}>
							<Window title={`${world.data.name} world map`} className={styles.worldWindow}>
								<Flex.Col
									style={{ height: 832 }}
									fullWidth fixedHeight
								>
									<ScrollBox
										containerStyle={{
											width: '100%',
											height: '100%',
										}}
										direction='both'
									>
										<Flex.Row fullWidth fullHeight justify='center' align='center'>
											<Canvas
												draw={renderWorldMap}
												onClick={e => {
													if (!world) return;
													const canvas = e.currentTarget;
													const rect = canvas.getBoundingClientRect();
													const { tileSize, offsetX, offsetY, zoom } = viewSettings;
													let x = Math.floor((e.clientX - rect.left) / (tileSize * zoom)) - offsetX;
													let y = Math.floor((e.clientY - rect.top) / (tileSize * zoom)) - offsetY;
													if (x <= 0) x += world.data.width;
													if (y <= 0) y += world.data.height;
													let tile: World['tiles'][number] | null = null;
													for (const t of world.data.tiles) {
														if (x === t.x && y === t.y) {
															tile = t;
															break;
														}
													}
													setSelectedTile(tile);
												}} />
										</Flex.Row>
									</ScrollBox>
								</Flex.Col>
							</Window>
							<Flex.Col fullWidth>
								<Flex.Row fullWidth gap={32}>
									<Flex.Col flex={1}>
										<InfoWindow world={world.data} />
									</Flex.Col>
									<Flex.Col flex={1}>
										<CellInfoWindow
											biomeColors={biomes.indexed}
											noWorld={!world}
											tile={selectedTile}
										/>
									</Flex.Col>
								</Flex.Row>
							</Flex.Col>
						</Flex.Col>
					</ScrollBox>
				</Flex.Col>
				<Flex.Col fullHeight style={{ width: '30%' }}>
					<ScrollBox containerStyle={{
						height: '100%',
						width: '100%',
						flex: 1,
						minHeight: 0,
					}}>
						<Flex.Col fullWidth gap={32} style={{ margin: '32px 0', height: 'fit-content' }}>
							<ViewSettingsWindow
								setViewSettings={setViewSettings}
								viewSettings={viewSettings}
								renderTime={renderTime}
								worldHeight={world.data.height}
								worldWidth={world.data.width}
							/>
							<BiomesWindow
								disabled={false}
								mode={viewSettings.mode}
								value={biomes.data}
								onChange={biomes => setBiomes({ biomes })}
							/>
						</Flex.Col>
					</ScrollBox>
				</Flex.Col>
			</Flex.Row >
		</MainLayout >
	);
};

export default EditorPage;
