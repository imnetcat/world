/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export class EventEmitter {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private events: Map<string | symbol, any>;
	constructor() {
		this.events = new Map();
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	on(name: string | symbol, fn: (...args: any[]) => void) {
		const event = this.events.get(name);
		if (event) {
			event.add(fn);
		} else {
			this.events.set(name, new Set([fn]));
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	once(name: string | symbol, fn: (...args: any[]) => void) {
		const event = this.events.get(name);
		const wrapped = () => {
			this.remove(name, wrapped);
			fn();
		};
		if (event) {
			event.add(wrapped);
		} else {
			this.events.set(name, new Set([wrapped]));
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	emit(name: string | symbol, ...args: any[]) {
		const event = this.events.get(name);
		if (!event) return;
		for (const fn of event.values()) fn(...args);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	remove(name: string | symbol, fn: (...args: any[]) => void) {
		const event = this.events.get(name);
		if (!event) return;
		if (event.has(fn)) {
			event.delete(fn);
			return;
		}
	}

	clear(name: string | symbol) {
		if (name) {
			this.events.delete(name);
		} else {
			this.events.clear();
		}
	}
}
