import { main as time } from './time';
import { main as test } from './test';

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
	}
})();
