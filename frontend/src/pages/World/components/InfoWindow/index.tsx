import { World } from 'api/world';
import { useDeleteWorldSaveMutation } from 'app/hooks';
import { Loader } from 'components/Loader';
import Window from 'components/Window';
import { Button } from 'ui/Button';
import Flex from 'ui/Flex';
import { ScrollBox } from 'ui/Scrollbox';
import { Text, Title } from 'ui/Typography';
import styles from './InfoWindow.module.scss';

interface InfoWindowProps {
    world: World | null;
    loading?: boolean;
}

export const InfoWindow = ({ world, loading }: InfoWindowProps) => {
    const [deleteWorld] = useDeleteWorldSaveMutation();

    return (
        <Window title={`World${world?.name ? ` "${world.name}"` : ''} info`} style={{
            height: 500,
        }}
            className={styles.window}>
            {loading &&
                <Flex.Col justify='center' align='center' fullHeight fullWidth>
                    <Loader />
                </Flex.Col>
            }
            {!loading && !world &&
                <Flex.Col flex={1} justify='center' fullHeight fullWidth>
                    <Title center wrap='breakSpaces'>Generate first world in the right panel --{'>'}</Title>
                </Flex.Col>
            }
            {!loading && world &&
                <Flex.Col wrap fullWidth gap={16}>
                    <Flex.Row fullWidth>
                        <Flex.Row gap={4}>
                            <Text size={2} type='secondary'>Name:</Text>
                            <Text size={2} wrap='breakSpaces'>{'"'}{world.name}{'"'}</Text>
                        </Flex.Row>
                    </Flex.Row>
                    <Flex.Row fullWidth>
                        <Flex.Row gap={4}>
                            <Text size={2} type='secondary'>Seed:</Text>
                            <Text size={2} wrap='breakSpaces'>{'"'}{world.generatorConfig.seed}{'"'}</Text>
                        </Flex.Row>
                    </Flex.Row>
                    <Flex.Row fullWidth gap={32}>
                        <Flex.Col>
                            <Flex.Row gap={4}>
                                <Text size={2} type='secondary'>Size (in tiles):</Text>
                                <Text size={2}>{`${world.height}x${world.width}`}</Text>
                            </Flex.Row>
                        </Flex.Col>
                        <Flex.Col>
                            <Flex.Row gap={4}>
                                <Text size={2} type='secondary'>Tiles:</Text>
                                <Text size={2}>{world.tiles.length}</Text>
                            </Flex.Row>
                        </Flex.Col>
                        <Flex.Col>
                            <Flex.Row gap={4}>
                                <Text size={2} type='secondary'>Generation time:</Text>
                                <Text size={2}>{`${world.generationTime / 1000} sec`}</Text>
                            </Flex.Row>
                        </Flex.Col>
                    </Flex.Row>
                    <Flex.Row fullWidth gap={4}>
                        <Text size={2} type='secondary'>Generation config:</Text>
                        <ScrollBox containerStyle={{
                            width: '100%',
                            height: 256,
                        }}>
                            <Text size={2} wrap='breakSpaces'>{JSON.stringify(world.generatorConfig, null, 2)}</Text>
                        </ScrollBox>
                    </Flex.Row>
                    <Flex.Row flex={1} />
                    <Flex.Row fullWidth gap={16} justify='center' align='center'>
                        <Flex.Col>
                            <Button
                                onClick={() => deleteWorld({ id: world.id })}
                                danger type='primary'
                            >
                                Delete
                            </Button>
                        </Flex.Col>
                    </Flex.Row>
                </Flex.Col>
            }
        </Window>
    );
};
