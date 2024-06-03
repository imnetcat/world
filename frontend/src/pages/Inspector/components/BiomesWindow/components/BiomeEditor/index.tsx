import { Input, Tooltip } from 'antd';
import { Biome } from 'api/world';
import { SketchPicker } from 'react-color';
import Flex from 'ui/Flex';
import { Text } from 'ui/Typography';
import styles from './BiomeEditor.module.scss';

interface BiomeEditorProps {
    disabled: boolean;
    value: Biome;
    onChange: (data: Biome) => void;
    heightRange: [number, number];
    temperatureRange: [number, number];
    moistureRange: [number, number];
}
interface BiomeEditorWrapperProps extends Omit<BiomeEditorProps, 'value' | 'onChange'> {
    value?: Biome;
    onChange?: (data: Biome) => void;
}

export const BiomeEditorWrapper = ({ value, onChange, ...props }: BiomeEditorWrapperProps) => {
    if (!value || !onChange) return <></>;
    return <BiomeEditor value={value} onChange={onChange} {...props} />;
}

const ColorPicker = ({ disabled, value, onChange }: { disabled: boolean; value?: string, onChange?: (data: string) => void }) => (
    disabled ? (
        <div className={styles.pickerBox} >
            <div className={styles.pickerCurrentColorBox} style={{ background: value }} />
        </div>
    ) : (
        <Tooltip title={<SketchPicker color={value} onChangeComplete={({ hex }) => onChange?.(hex)} />}>
            <div className={styles.pickerBox} >
                <div className={styles.pickerCurrentColorBox} style={{ background: value }} />
            </div>
        </Tooltip>
    )
);

export const BiomeEditor = ({
    heightRange,
    temperatureRange,
    moistureRange,
    disabled,
    value,
    onChange
}: BiomeEditorProps) => {
    const height = [
        value.height?.[0] === undefined ? -1 : value.height[0],
        value.height?.[1] === undefined ? -1 : value.height[1]
    ];
    const temperature = [
        value.temperature?.[0] === undefined ? -1 : value.temperature[0],
        value.temperature?.[1] === undefined ? -1 : value.temperature[1]
    ];
    const moisture = [
        value.moisture?.[0] === undefined ? -1 : value.moisture[0],
        value.moisture?.[1] === undefined ? -1 : value.moisture[1]
    ];

    return (
        <Flex.Row align='center' gap={8}>
            <Flex.Col>
                <ColorPicker
                    value={value?.color}
                    onChange={color => onChange?.({ ...value, color })}
                    disabled={disabled}
                />
            </Flex.Col>
            <Flex.Col gap={8} align='center'>
                <Flex.Row><Text size={2} bold style={{ color: value.color }}>{value.biome}</Text></Flex.Row>
                <Flex.Row gap={4}>
                    <Flex.Col>
                        <Input
                            min={heightRange[0]}
                            max={heightRange[1]}
                            step={0.05}
                            type='number'
                            value={height[0]}
                            onChange={e => onChange?.({ ...value, height: [Number(e.currentTarget.value), height[1]] })}
                        />
                    </Flex.Col>
                    <Flex.Col>
                        <Input
                            min={heightRange[0]}
                            max={heightRange[1]}
                            step={0.05}
                            type='number'
                            value={height[1]}
                            onChange={e => onChange?.({ ...value, height: [height[0], Number(e.currentTarget.value)] })}
                        />
                    </Flex.Col>
                    <Flex.Col>
                        <Input
                            min={temperatureRange[0]}
                            max={temperatureRange[1]}
                            step={0.05}
                            type='number'
                            value={temperature[0]}
                            onChange={e => onChange?.({ ...value, temperature: [Number(e.currentTarget.value), temperature[1]] })}
                        />
                    </Flex.Col>
                    <Flex.Col>
                        <Input
                            min={temperatureRange[0]}
                            max={temperatureRange[1]}
                            step={0.05}
                            type='number'
                            value={temperature[1]}
                            onChange={e => onChange?.({ ...value, temperature: [temperature[0], Number(e.currentTarget.value)] })}
                        />
                    </Flex.Col>
                    <Flex.Col>
                        <Input
                            min={moistureRange[0]}
                            max={moistureRange[1]}
                            step={0.05}
                            type='number'
                            value={moisture[0]}
                            onChange={e => onChange?.({ ...value, moisture: [Number(e.currentTarget.value), moisture[1]] })}
                        />
                    </Flex.Col>
                    <Flex.Col>
                        <Input
                            min={moistureRange[0]}
                            max={moistureRange[1]}
                            step={0.05}
                            type='number'
                            value={moisture[1]}
                            onChange={e => onChange?.({ ...value, moisture: [moisture[0], Number(e.currentTarget.value)] })}
                        />
                    </Flex.Col>
                </Flex.Row>
            </Flex.Col>
        </Flex.Row>
    );
};
