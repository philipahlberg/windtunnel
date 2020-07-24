import child_process from 'child_process';
import process from 'process';
import util from 'util';
import fs from 'fs';

const run = util.promisify(child_process.exec);
const readFile = util.promisify(fs.readFile);

(async () => {
  try {
    const pkg = JSON.parse(await readFile('package.json'));
    for (const workspace of pkg.workspaces) {
      console.log(`Testing ${workspace}...`);
      const output = await run(`cd ${workspace} && npm test`);
      console.error(output.stderr);
      console.log(output.stdout);
    }
    process.exit(0);
  } catch (error) {
    console.error('Failed:');
    console.error(error);
    process.exit(1);
  }
})();
