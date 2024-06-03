import { World } from 'api/world';
import Window from 'components/Window';
import Flex from 'ui/Flex';
import { Text, Title } from 'ui/Typography';
import styles from './CellInfoWindow.module.scss';

interface CellInfoWindowProps {
    tile: World['tiles'][number] | null;
    biomeColors: Record<string, string>;
    noWorld: boolean;
}

export const CellInfoWindow = ({ tile, biomeColors, noWorld }: CellInfoWindowProps) => {
    return (
        <Window title={`Tile info`} style={{
            height: 'min-content',
        }} className={styles.window}>
            {noWorld &&
                <Flex.Col flex={1} justify='center' fullHeight fullWidth>
                    <Title center wrap='breakSpaces'>Generate first world in the right panel --{'>'}</Title>
                </Flex.Col>
            }
            {!tile && !noWorld &&
                <Flex.Col flex={1} justify='center' fullHeight fullWidth>
                    <Title center wrap='breakSpaces'>Click on map</Title>
                </Flex.Col>
            }
            {tile &&
                <Flex.Col wrap fullWidth gap={16}>
                    <Flex.Row fullWidth gap={16} align='center'>
                        <Flex.Col style={{ backgroundColor: biomeColors[tile.biome], width: 150, height: 150 }} />
                        <Flex.Col gap={4}>
                            <Flex.Row gap={4}>
                                <Text type='secondary'>Coordinates:</Text>
                                <Text wrap='breakSpaces'>({tile.x},{' '}{tile.y})</Text>
                            </Flex.Row>
                            <Flex.Row gap={4}>
                                <Text size={2} type='secondary'>Biome:</Text>
                                <Text size={2} wrap='breakSpaces'>{tile.biome}</Text>
                            </Flex.Row>
                            <Flex.Row gap={4}>
                                <Text size={2} type='secondary'>Height:</Text>
                                <Text size={2} wrap='breakSpaces'>{tile.height}</Text>
                            </Flex.Row>
                            <Flex.Row gap={4}>
                                <Text size={2} type='secondary'>Temperature:</Text>
                                <Text size={2} wrap='breakSpaces'>{tile.temperature}</Text>
                            </Flex.Row>
                            <Flex.Row gap={4}>
                                <Text size={2} type='secondary'>Moisture:</Text>
                                <Text size={2} wrap='breakSpaces'>{tile.moisture}</Text>
                            </Flex.Row>
                        </Flex.Col>
                    </Flex.Row>
                </Flex.Col>
            }
        </Window>
    );
};
