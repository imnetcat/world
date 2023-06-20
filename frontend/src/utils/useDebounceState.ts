import { useEffect, useState } from 'react';

export const useDebounceState = <T>(value: T, onChange: (t: T) => void, delay: number): [T, React.Dispatch<React.SetStateAction<T>>] => {
	// State and setters for debounced value
	const state = useState(value);

	useEffect(
		() => {
			// Update debounced value after delay
			const handler = setTimeout(() => {
				state[1](value);
				onChange(value);
			}, delay);

			// Cancel the timeout if value changes (also on delay change or unmount)
			// This is how we prevent debounced value from updating if value is changed ...
			// .. within the delay period. Timeout gets cleared and restarted.
			return () => {
				clearTimeout(handler);
			};
		},
		[value, delay] // Only re-call effect if value or delay changes
	);

	return state;
};
