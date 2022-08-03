import { time } from "./time";
import { test } from "./test";
import { help } from "./help";

(async () => {
	const args = process.argv.slice(2);

	const [command, ...input] = args;

	switch (command) {
		case "test":
			await test(input);
			break;
		case "time":
			await time(input);
			break;
		default:
			help();
			break;
	}
})();
