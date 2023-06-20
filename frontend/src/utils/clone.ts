// change if there is better way
export function clone<T>(objectToBeCloned: T): T {
	if (!(objectToBeCloned instanceof Object)) {
		return objectToBeCloned;
	}

	const objectClone = JSON.parse(JSON.stringify(objectToBeCloned));

	return objectClone;
}
