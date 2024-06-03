export type Optional<T> = T | undefined | null;

export type Unwrap<T> = T extends Promise<infer U>
	? U
	: T extends (...args: unknown[]) => Promise<infer U>
	? U
	: T extends (...args: unknown[]) => infer U
	? U
	: T;

export type FirstParameter<T extends (...args: unknown[]) => void> =
	Parameters<T>[0];

export interface CommonPage { match: { params: { id: string } } };
export type ViewSettingsMode = 'terrain' | 'height' | 'moisture' | 'temperature';