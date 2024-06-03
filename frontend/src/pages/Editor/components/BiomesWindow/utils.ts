import { Biomes } from "api/world";

export type BiomesDenormalized = {
    marine: Biomes;
    polar: Biomes;
    subtropical: Biomes;
    tropical: Biomes;
    generic: Biomes;
}

export const denormalizeBiomes = (biomes: Biomes): BiomesDenormalized => {
    const marine = biomes.filter(({ height }) => height && height[1] <= 0)
    const land = biomes.filter(({ height }) => height && height[0] >= 0)
    const polar = land.filter(({ temperature }) =>
        temperature && temperature[1] <= -0.3
    );
    const subtropical = land.filter(({ temperature }) =>
        temperature && temperature[0] >= -0.3 && temperature[1] <= 0.5
    );
    const tropical = land.filter(({ temperature }) =>
        temperature && temperature[0] >= 0.5
    );
    return {
        marine,
        polar,
        subtropical,
        tropical,
        generic: biomes.filter(({ biome }) =>
            !marine.find(({ biome: b }) => b === biome)
            && !polar.find(({ biome: b }) => b === biome)
            && !subtropical.find(({ biome: b }) => b === biome)
            && !tropical.find(({ biome: b }) => b === biome)
        ),
    }
}

export const normalizeBiomes = (biomes: BiomesDenormalized): Biomes =>
    [...biomes.marine, ...biomes.polar, ...biomes.subtropical, ...biomes.tropical, ...biomes.generic];
