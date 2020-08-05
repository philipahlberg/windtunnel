import child_process from 'child_process';
import process from 'process';
import util from 'util';
import fs from 'fs';

const readFile = util.promisify(fs.readFile);
const removeDirectory = util.promisify(fs.rmdir);

(async () => {
  try {
    await removeDirectory('./node_modules', {
      recursive: true,
    });

    // Get the top-level package.json file
    const pkg = JSON.parse(await readFile('package.json'));
    // Get all the nested package.json files
    const workspaces = pkg.workspaces.reverse();
    const projects = await Promise.all(workspaces.map(async (directory) => {
      const file = await readFile(`${directory}/package.json`);
      const pkg = JSON.parse(file);
      return {
        directory,
        package: pkg,
      }
    }));

    for (const project of projects) {
      const directory = project.directory;
      await removeDirectory(`${directory}/node_modules`, {
        recursive: true,
      });
      await removeDirectory(`${directory}/dist`, {
        recursive: true,
      });
    }
    process.exit(0);
  } catch (error) {
    console.error('Failed:');
    console.error(error);
    process.exit(1);
  }
})();
