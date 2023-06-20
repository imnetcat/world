import { Biomes, World } from 'api/world';
import { Canvas } from 'components/Canvas';
import { ViewSettings } from 'pages/World/components/ViewSettingsWindow';
import { getTileColor } from 'pages/World/utils';
import { useCallback, useMemo, useState } from 'react';
import Flex from 'ui/Flex';
import { Text, Title } from 'ui/Typography';
import styles from './BiomeDistributionDiogram.module.scss';
import { TILE_SIZE, WORLD_HEIGHT, WORLD_WIDTH, generateRedestributionMap } from './utils';

interface BiomeDistributionDiogramProps {
    value: Biomes;
    mode: ViewSettings['mode'];
    temperatureRange: [number, number];
    heightRange: [number, number];
    moistureRange: [number, number];
}
export const BiomeDistributionDiogram = ({
    value,
    mode,
    temperatureRange,
    heightRange,
    moistureRange,
}: BiomeDistributionDiogramProps) => {
    const [selectedTile, setSelectedTile] = useState<(World['tiles'][number] & { biomeColor: string }) | null>(null);
    const tiles: Array<(World['tiles'][number] & { biomeColor: string })> = useMemo(() => generateRedestributionMap({
        temperatureRange,
        heightRange,
        moistureRange,
        biomes: value,
    }), [value]);

    const renderBiomesRedistribution = useCallback((context: CanvasRenderingContext2D) => {
        context.fillStyle = '#000000';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        for (let i = 0; i < tiles.length; i++) {
            const x = tiles[i].x * TILE_SIZE;
            const y = tiles[i].y * TILE_SIZE;
            context.fillStyle = getTileColor(tiles[i], tiles[i]?.biomeColor, mode);
            context.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        }
    }, [tiles, mode]);

    return (
        <Flex.Row align='center' justify='center' fullWidth gap={8} wrap>
            <Flex.Col fullWidth>
                <Title center level={3}>Distribution</Title>
                <Text center type='secondary'>(All tiles should be filled with presented set of biomes)</Text>
            </Flex.Col>
            <Flex.Col fullWidth>
                <Flex.Row fullWidth align='center' justify='center' gap={16}>
                    <Flex.Col align='start' justify='center' flex={1} gap={8}>
                        {selectedTile && <>
                            <Flex.Row>Biome: {selectedTile.biome}</Flex.Row>
                            <Flex.Row>Height: {selectedTile.height}</Flex.Row>
                            <Flex.Row>Moisture: {selectedTile.moisture}</Flex.Row>
                            <Flex.Row>Temperature: {selectedTile.temperature}</Flex.Row>
                        </>
                        }
                    </Flex.Col>
                    <Flex.Col align='center' justify='center' flex={1} className={styles.container}>
                        <Canvas
                            height={WORLD_HEIGHT * TILE_SIZE}
                            width={WORLD_WIDTH * TILE_SIZE}
                            draw={renderBiomesRedistribution}
                            onClick={e => {
                                const canvas = e.currentTarget;
                                const rect = canvas.getBoundingClientRect();
                                const x = Math.floor((e.clientX - rect.left) / (TILE_SIZE));
                                const y = Math.floor((e.clientY - rect.top) / (TILE_SIZE));
                                let tile: (World['tiles'][number] & { biomeColor: string }) | null = null;
                                for (const t of tiles) {
                                    if (x === t.x && y === t.y) {
                                        tile = t;
                                        break;
                                    }
                                }
                                setSelectedTile(tile);
                            }}
                        />
                    </Flex.Col>
                </Flex.Row>
            </Flex.Col>
        </Flex.Row>
    );
};
