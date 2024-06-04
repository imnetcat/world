({
    generator: (seed) => {
        const seedFunc = npm.alea(seed);
        const createNoise = npm['simplex-noise'].createNoise4D;
        const genTerrain = createNoise(seedFunc);
        const genTemperature = createNoise(npm.alea(seed.toString().split('').reverse().join('')));
        const genMoisture = createNoise(npm.alea(node.crypto.createHash('md5').update(seed).digest('hex')));
        return { genTerrain, genTemperature, genMoisture };
    },

    // wrap around generated noise in all 2 axis
    // see more "torus noise 2D"
    // wrapNoiseXY(noiseFunc, nx, ny) {
    //     // const TAU = 2 * Math.PI;
    //     // const TAU = Math.PI;
    //     // const TAU = 1.41421356237;
    //     const TAU = 2 * Math.PI;
    //     const angle_x = TAU * nx;
    //     const angle_y = TAU * ny;
    //     return noiseFunc(Math.cos(angle_x) / TAU, Math.sin(angle_x) / TAU,
    //         Math.cos(angle_y) / TAU, Math.sin(angle_y) / TAU);
    // },

    // wrap around generated noise in all 2 axis
    // see more "torus noise 2D"
    wrapNoiseXY(noiseFunc, nx, ny, i) {
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
        return noiseFunc(x1, x2, y1, y2);
    },
});
