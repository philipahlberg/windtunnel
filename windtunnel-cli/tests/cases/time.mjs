export function reallySlow() {
	let count = 0;
	for (let i = 0; i < 1_000_000_000; i++) {
		count = count + 1;
	}
	return count;
}

export function prettySlow() {
	let count = 0;
	for (let i = 0; i < 1_000_000; i++) {
		count = count + 1;
	}
	return count;
}
