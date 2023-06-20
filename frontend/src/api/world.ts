export interface World {
	id: string;
	name: string;
	height: number;
	width: number;
	tiles: Array<{
		height: number;
		x: number;
		y: number;
		biome: string;
		moisture: number;
		releasedMoisture: number;
		windDirection: number;
		temperature: number;
	}>;
	generatorConfig: {
		seed: string;
		sharpness: number;
		fudgeFactor: number;
		terrainAmplitudes: Array<number>;
		moistureAmplitudes: Array<number>;
		temperatureAmplitudes: Array<number>;
		temperature: number;
	};
	generationTime: number; // in ms
	createdAt: Date;
}

export type WorldListItem = Omit<World, 'tiles'>;


export type WorldBase = Omit<World, 'id' | 'tiles' | 'createdAt' | 'generationTime'>;

export interface Biome {
	biome: string;
	height?: [number, number];
	temperature?: [number, number];
	moisture?: [number, number];
	color: string;
}

export type Biomes = Array<Biome>;
