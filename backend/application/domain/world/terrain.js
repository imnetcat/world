({
    getTile(height, moisture, temperature) {
        // Find biomes that suits for current tile
        const defs = domain.world.biomes.defs
            .filter(({ height: h, moisture: m, temperature: t }) =>
                // filter by terrain height
                (!h ? true : (height >= h[0] && height <= h[1]))
                // filter by moisture value
                && (!m ? true : (moisture >= m[0] && moisture <= m[1]))
                // filter by temperature value
                && (!t ? true : (temperature >= t[0] && temperature <= t[1]))
            );
        const index = Math.floor(Math.random() * defs.length);
        if (!defs[index]) {
            throw new Error('no biome found', {
                height, moisture, temperature
            });
        }
        return {
            biome: defs[index].biome,
            height,
            moisture,
            temperature,
        };
    },

    // wrap around generated noise in all 4 direction
    // torusnoise(noise4D, nx, ny) {
    //     // const TAU = 2 * Math.PI;
    //     // const TAU = Math.PI;
    //     // const TAU = 1.41421356237;
    //     const TAU = 2 * Math.PI;
    //     const angle_x = TAU * nx;
    //     const angle_y = TAU * ny;
    //     return noise4D(Math.cos(angle_x) / TAU, Math.sin(angle_x) / TAU,
    //         Math.cos(angle_y) / TAU, Math.sin(angle_y) / TAU);
    // },

    // wrap around generated noise in all 4 direction
    torusnoise(noise4D, nx, ny, i) {
        // const TAU = Math.PI / 2;
        // const TAU = Math.PI;
        // const TAU = 1.41421356237;
        const TAU = 2 * Math.PI;
        const angle_x = TAU * nx;
        const angle_y = TAU * ny;
        let x1 = Math.cos(angle_x) / TAU;
        let x2 = Math.sin(angle_x) / TAU;
        x1 *= Math.pow(2, i);
        x2 *= Math.pow(2, i);
        let y1 = Math.cos(angle_y) / TAU;
        let y2 = Math.sin(angle_y) / TAU;
        y1 *= Math.pow(2, i);
        y2 *= Math.pow(2, i);
        return noise4D(x1, x2, y1, y2);
    },

    // width, height - in tiles size
    // return struct of generated world data
    // see https://www.redblobgames.com/maps/terrain-from-noise/
    generate(width, height, generatorConfig) {
        const { torusnoise } = domain.world.terrain;
        const {
            seed,
            sharpness,
            fudgeFactor,
            temperature,
            terrainAmplitudes = [],
            moistureAmplitudes = [],
            temperatureAmplitudes = [],
        } = generatorConfig;
        // const tiles = new Array(height).fill(new Array(width).fill({}));
        const tiles = [];
        const seedFunc = npm.alea(seed);
        const createNoise = npm['simplex-noise'].createNoise4D;
        const genTerrain = createNoise(seedFunc);
        const genTemperature = createNoise(npm.alea(seed.toString().split('').reverse().join('')));
        const genMoisture = createNoise(npm.alea(node.crypto.createHash('md5').update(seed).digest('hex')));
        const generationTimeStart = new Date().getTime();

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const nx = x / width - 1;
                const ny = y / height - 1;

                // generate common temperature value in coordinate (x, y)
                const t1 = Math.abs((height / 2 - y) / height * 2) * -2 + 1;

                // generate temperature noise in coordinate (x, y)
                const t2 = temperatureAmplitudes.length === 0
                    ? torusnoise(genTemperature, nx, ny)
                    : temperatureAmplitudes.reduce((acc, amplitude, i) =>
                        // acc + amplitude * torusnoise(genTemperature, Math.pow(2, i) * nx, Math.pow(2, i) * ny), 0
                        acc + amplitude * torusnoise(genTemperature, nx, ny, i), 0
                    ) / temperatureAmplitudes.reduce((acc, amplitude) => acc + amplitude, 0);

                let t = t1 + t2 + temperature;
                if (Number.isNaN(t)) {
                    throw new Error('temperature is NaN', {
                        t1, t2, temperature, temperatureAmplitudes
                    });
                }
                if (t > 1) t = 1;
                if (t < -1) t = -1;

                // generate terrain height in coordinate (x, y)
                let h = terrainAmplitudes.length === 0
                    ? torusnoise(genTerrain, nx, ny)
                    : terrainAmplitudes.reduce((acc, amplitude, i) =>
                        // acc + amplitude * torusnoise(genTerrain, Math.pow(2, i) * nx, Math.pow(2, i) * ny), 0
                        acc + amplitude * torusnoise(genTerrain, nx, ny, i), 0
                    ) / terrainAmplitudes.reduce((acc, amplitude) => acc + amplitude, 0);

                // redistribution
                const hCopy = h;
                h = Math.pow(Math.abs(h) * fudgeFactor, sharpness);
                if (Number.isNaN(h)) {
                    throw new Error('height is NaN', {
                        hCopy, h, terrainAmplitudes
                    });
                }
                if (hCopy < 0) h *= -1;
                if (h > 1) h = 1;
                if (h < -1) h = -1;

                // generate common moisture value in coordinate (x, y)
                const mBaseY = Math.abs((height / 2 - y) / height * 2) * -1;
                const m1 = Math.pow(Math.E, -mBaseY) * Math.cos(15 * mBaseY);
                // const m1 = y > 0
                //     ? Math.pow(Math.E, -Math.abs(mBaseY)) * Math.cos(14 * mBaseY)
                //     : Math.pow(Math.E, Math.abs(mBaseY)) * Math.cos(14 * mBaseY);
                const m3 = Math.cos(4 * t);

                // generate moisture value noise in coordinate (x, y)
                const m2 = moistureAmplitudes.length === 0
                    ? torusnoise(genMoisture, nx, ny)
                    : moistureAmplitudes.reduce((acc, amplitude, i) =>
                        // acc + amplitude * torusnoise(genMoisture, Math.pow(2, i) * nx, Math.pow(2, i) * ny), 0
                        acc + amplitude * torusnoise(genMoisture, nx, ny, i), 0
                    ) / moistureAmplitudes.reduce((acc, amplitude) => acc + amplitude, 0);

                let m = m1 + m2 + m3;
                if (Number.isNaN(m)) {
                    throw new Error('moisture is NaN', {
                        m, m1, m2, moistureAmplitudes
                    });
                }
                if (m > 1) m = 1;
                if (m < -1) m = -1;

                // tiles[x][y] = domain.world.terrain.getTile(h, m, t);
                tiles.push({
                    x, y,
                    ...domain.world.terrain.getTile(h, m, t)
                });
            }
        }
        const generationTimeEnd = new Date().getTime();
        return {
            tiles,
            width,
            height,
            generatorConfig,
            generationTime: generationTimeEnd - generationTimeStart,
        };
    },

    // worldData - result from generate method above
    // tileSize - size of tile in pixel (tile is a square)
    // return png of world in buffer
    // async draw(worldData, tileSize) {
    //     const {
    //         tiles,
    //         width,
    //         height,
    //     } = worldData;

    //     const widthInPixel = width * tileSize;
    //     const heightInPixel = height * tileSize;
    //     const bitmap2d = new Array(widthInPixel).fill(new Array(heightInPixel).fill(0));

    //     for (let i = 0; i < tiles.length; i++) {
    //         const tile = tiles[i];
    //         const x = tile.x * tileSize;
    //         const y = tile.y * tileSize;
    //         for (let i = x; i < x + tileSize; i++) {
    //             for (let j = y; j < y + tileSize; y++) {
    //                 bitmap2d[i][j] = tile.color;
    //             }
    //         }
    //     }

    //     const image = new npm.jimp(widthInPixel, heightInPixel, (err, image) => {
    //         if (err) throw err;
    //         bitmap2d.forEach((row, y) => {
    //             row.forEach((color, x) => {
    //                 image.setPixelColor(color, x, y);
    //             });
    //         });
    //     });

    //     return image.getBufferAsync(npm.jimp.MIME_PNG);
    // }
})