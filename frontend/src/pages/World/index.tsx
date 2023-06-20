import { World } from 'api/world';
import { useGetBiomesQuery, useGetWorldLastSaveQuery, useSetBiomesMutation } from 'app/hooks';
import { Canvas } from 'components/Canvas';
import { Loader } from 'components/Loader';
import MainLayout from 'components/MainLayout';
import Window from 'components/Window';
import { useCallback, useEffect, useState } from 'react';
import Flex from 'ui/Flex';
import { ScrollBox } from 'ui/Scrollbox';
import { Title } from 'ui/Typography';
import styles from './World.module.scss';
import { BiomesWindow } from './components/BiomesWindow';
import { CellInfoWindow } from './components/CellInfoWindow';
import { GeneratorWindow } from './components/GeneratorWindow';
import { InfoWindow } from './components/InfoWindow';
import { SavesWindow } from './components/SavesWindow';
import { ViewSettings, ViewSettingsWindow } from './components/ViewSettingsWindow';
import { generateRandomSeed, getTileColor } from './utils';

const WorldPage = () => {
	const [loading, setLoading] = useState(true);
	const { data: lastSave, isLoading: lastSaveLoading } = useGetWorldLastSaveQuery({});
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
	const [world, setWorld] = useState<World | null>(null);
	const [renderTime, setRenderTime] = useState<number | null>(null);
	const [loadTime, setLoadTime] = useState<number | null>(null);

	useEffect(() => {
		if (!lastSave?.data) return;
		setWorld(lastSave.data);
		setLoadTime(new Date().getTime() - lastSave.time);
	}, [lastSave]);

	useEffect(() => {
		setSelectedTile(null);
	}, [world]);

	const renderWorldMap = useCallback((context: CanvasRenderingContext2D) => {
		if (!world || !biomes) return;

		const { tiles } = world;
		const { tileSize, mode, offsetX, offsetY, zoom } = viewSettings;
		const renderTimeStart = new Date().getTime();
		context.canvas.width = tileSize * world.width * zoom;
		context.canvas.height = tileSize * world.height * zoom;
		context.fillStyle = '#000000';
		context.fillRect(0, 0, context.canvas.width, context.canvas.height);
		context.scale(zoom, zoom);
		for (let i = 0; i < tiles.length; i++) {
			const tile = tiles[i];
			let x = tile.x + offsetX;
			let y = tile.y + offsetY;
			if (x >= world.width) {
				x -= world.width;
			}
			if (y >= world.height) {
				y -= world.height;
			}
			x *= tileSize;
			y *= tileSize;
			context.fillStyle = getTileColor(tile, biomes.indexed[tile.biome] || '#000000', mode);
			context.fillRect(x, y, tileSize, tileSize);
		}
		const renderTimeEnd = new Date().getTime();
		setRenderTime(renderTimeEnd - renderTimeStart);
		setLoading(false);
	}, [world, viewSettings, biomes]);

	if (!biomes || biomesLoading || lastSaveLoading) {
		return (
			<MainLayout sidebarActiveOption='world'>
				<Loader size='large' />
			</MainLayout>
		);
	}

	return (
		<MainLayout sidebarActiveOption='world'>
			<Flex.Row fullHeight fullWidth gap={32}>
				<Flex.Col fullHeight style={{ width: '70%' }}>
					<ScrollBox containerStyle={{
						height: '100%',
						width: '100%',
						flex: 1,
						minHeight: 0,
					}}>
						<Flex.Col fullWidth gap={32} style={{ margin: '32px 0', height: 'fit-content' }}>
							<Window title={`World${world?.name ? ` "${world.name}"` : ''} map`} className={styles.worldWindow}>
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
										<Flex.Col fullHeight justify='center' align='center'>
											{loading && <Loader />}
											{!loading && !world &&
												<Title center wrap='breakSpaces'>Generate first world in the right panel --{'>'}</Title>
											}
											{world &&
												<Canvas
													style={{ display: loading ? 'none' : 'inherit' }}
													draw={renderWorldMap}
													onClick={e => {
														if (!world) return;
														const canvas = e.currentTarget;
														const rect = canvas.getBoundingClientRect();
														const { tileSize, offsetX, offsetY, zoom } = viewSettings;
														let x = Math.floor((e.clientX - rect.left) / (tileSize * zoom)) - offsetX;
														let y = Math.floor((e.clientY - rect.top) / (tileSize * zoom)) - offsetY;
														if (x <= 0) x += world.width;
														if (y <= 0) y += world.height;
														let tile: World['tiles'][number] | null = null;
														for (const t of world.tiles) {
															if (x === t.x && y === t.y) {
																tile = t;
																break;
															}
														}
														setSelectedTile(tile);
													}} />
											}
										</Flex.Col>
									</ScrollBox>
								</Flex.Col>
							</Window>
							<Flex.Col fullWidth>
								<Flex.Row fullWidth gap={32}>
									<Flex.Col flex={1}>
										<InfoWindow loading={loading} world={world} />
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
							<SavesWindow
								onLoad={(data) => {
									if (data.loading) {
										setLoading(true);
										return;
									}
									setWorld(data.world);
									setLoadTime(data.time);
								}}
							/>
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
								loadTime={loadTime}
								worldHeight={world?.height}
								worldWidth={world?.width}
							/>
							{biomes &&
								<BiomesWindow
									disabled={false}
									mode={viewSettings.mode}
									value={biomes.data}
									onChange={biomes => setBiomes({ biomes })}
								/>
							}
							<GeneratorWindow
								value={{
									name: 'Untitled',
									height: 180,
									width: 320,
									generatorConfig: {
										seed: generateRandomSeed(),
										sharpness: 0.5,
										fudgeFactor: 1.25,
										temperature: 0,
										terrainAmplitudes: [0.5, 0.33, 0.16, 0.75, 0.5, 0.33],
										moistureAmplitudes: [0.16, 0.33, 0.75, 0.33, 0.5, 0.7],
										temperatureAmplitudes: [0.5, 0.33, 0.16, 0.75, 0.5, 0.33],
									},
								}}
								hasWorld={!!world}
								onChange={(data) => {
									if (data.loading) {
										setLoading(true);
										return;
									}
									setWorld(data.world);
									setLoadTime(data.time);
								}}
								onUseFromLoadedWorld={setter => world && setter({
									name: 'Untitled',
									height: world.height,
									width: world.width,
									generatorConfig: world.generatorConfig,
								})}
							/>
						</Flex.Col>
					</ScrollBox>
				</Flex.Col>
			</Flex.Row >
		</MainLayout >
	);
};

export default WorldPage;
