import { World } from "api/world";
import { ViewSettings } from "./components/ViewSettingsWindow";

export const generateRandomSeed = () => (Math.floor(Math.random() * 100000000) + 999999999).toString();

export const getTileColor = (tile: World['tiles'][number], tileBiomeColor: string, mode: ViewSettings['mode']): string => {
    switch (mode) {
        case 'terrain': return tileBiomeColor;
        case 'height': {
            const h = Math.floor((tile.height * -1 + 1) * 60) + 117;
            return `hsl(${h}, 100%, 50%)`;
        }
        case 'temperature': {
            const t = Math.floor((tile.temperature * -1 + 1) * 114);
            return `hsl(${t}, 75%, 62%)`;
        }
        case 'moisture': {
            let m = 20 + Math.floor((tile.moisture * -1 + 1) * 117.5);
            if (m > 255) m = 255;
            return `rgb(${m}, ${m}, 255)`;
        }
        default: // unknown mode
            return '#000000';
    }
}