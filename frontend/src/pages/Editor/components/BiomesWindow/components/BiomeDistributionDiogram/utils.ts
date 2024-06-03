import { Biomes, World } from 'api/world';

export const TILE_SIZE = 9;
export const WORLD_WIDTH = 32;
export const WORLD_HEIGHT = 8;

const TILES = new Array<World['tiles']>(WORLD_WIDTH)
    .fill(new Array<World['tiles'][number]>(WORLD_HEIGHT)
        .fill(null as unknown as World['tiles'][number]));

const genPseudoNoice = (x: number): number => x / (WORLD_WIDTH * 2);
const genInvertedPseudoNoice = (x: number): number => 1 - genPseudoNoice(x);
const generateValueInRange = (x: number, range: [number, number]): number => x * (range[1] - range[0]) + range[0];

export const generateRedestributionMap = ({
    temperatureRange,
    heightRange,
    moistureRange,
    biomes,
}: {
    temperatureRange: [number, number];
    heightRange: [number, number];
    moistureRange: [number, number];
    biomes: Biomes;
}): Array<(World['tiles'][number] & { biomeColor: string })> => {
    const heightMid = (heightRange[1] + heightRange[0]) / 2;
    const moistureMid = (moistureRange[1] + moistureRange[0]) / 2;
    const temperatureMid = (temperatureRange[1] + temperatureRange[0]) / 2;
    return TILES.map((row, x) => row.map((_, y) => {
        let height = heightMid;
        let moisture = moistureMid;
        let temperature = temperatureMid;
        switch (y) {
            case 0:
                height = generateValueInRange(genPseudoNoice(x), heightRange);
                moisture = generateValueInRange(genPseudoNoice(x), moistureRange);
                temperature = generateValueInRange(genPseudoNoice(x), temperatureRange);
                break;
            case 1:
                height = generateValueInRange(genInvertedPseudoNoice(x), heightRange);
                moisture = generateValueInRange(genInvertedPseudoNoice(x), moistureRange);
                temperature = generateValueInRange(genInvertedPseudoNoice(x), temperatureRange);
                break;
            case 2:
                height = generateValueInRange(genPseudoNoice(x), heightRange);
                moisture = generateValueInRange(genInvertedPseudoNoice(x), moistureRange);
                temperature = generateValueInRange(genInvertedPseudoNoice(x), temperatureRange);
                break;
            case 3:
                height = generateValueInRange(genInvertedPseudoNoice(x), heightRange);
                moisture = generateValueInRange(genPseudoNoice(x), moistureRange);
                temperature = generateValueInRange(genInvertedPseudoNoice(x), temperatureRange);
                break;
            case 4:
                height = generateValueInRange(genInvertedPseudoNoice(x), heightRange);
                moisture = generateValueInRange(genInvertedPseudoNoice(x), moistureRange);
                temperature = generateValueInRange(genPseudoNoice(x), temperatureRange);
                break;
            case 5:
                height = generateValueInRange(genPseudoNoice(x), heightRange);
                moisture = generateValueInRange(genPseudoNoice(x), moistureRange);
                temperature = generateValueInRange(genInvertedPseudoNoice(x), temperatureRange);
                break;
            case 6:
                height = generateValueInRange(genInvertedPseudoNoice(x), heightRange);
                moisture = generateValueInRange(genPseudoNoice(x), moistureRange);
                temperature = generateValueInRange(genPseudoNoice(x), temperatureRange);
                break;
            case 7:
                height = generateValueInRange(genPseudoNoice(x), heightRange);
                moisture = generateValueInRange(genInvertedPseudoNoice(x), moistureRange);
                temperature = generateValueInRange(genPseudoNoice(x), temperatureRange);
                break;
        }

        // Find biomes that suits for current tile
        const suitedBiomes = biomes
            .filter(({ height: h, moisture: m, temperature: t }) =>
                // filter by terrain height
                (!h ? true : (height >= h[0] && height <= h[1]))
                // filter by moisture value
                && (!m ? true : (moisture >= m[0] && moisture <= m[1]))
                // filter by temperature value
                && (!t ? true : (temperature >= t[0] && temperature <= t[1]))
            );
        const index = Math.floor(Math.random() * suitedBiomes.length);
        const biome = suitedBiomes[index]?.biome || '';
        const biomeColor = suitedBiomes[index]?.color || '';
        return {
            x, y,
            biome,
            biomeColor,
            height,
            moisture,
            temperature,
        }
    }))
        .flat();
}