import { time } from './time';
import { test } from './test';
import { help } from './help';

(async () => {
	const command = process.argv[2];
	const file = process.argv[3];
	switch (command) {
		case 'test':
			await test(file);
			break;
		case 'time':
			await time(file);
			break;
		default:
			help();
			break;
	}
})();
