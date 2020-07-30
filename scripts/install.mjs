import child_process from 'child_process';
import process from 'process';
import util from 'util';
import fs from 'fs';

const run = util.promisify(child_process.exec);
const readFile = util.promisify(fs.readFile);

(async () => {
  try {
    // Get the top-level package.json file
    const pkg = JSON.parse(await readFile('package.json'));
    // Get all the nested package.json files
    const projects = await Promise.all(pkg.workspaces.map(async (directory) => {
      const file = await readFile(`${directory}/package.json`);
      const pkg = JSON.parse(file);
      return {
        directory,
        package: pkg,
      }
    }));

    const packages = projects.map(project => project.package.name);

    for (const project of projects) {
      // Install the project's dependencies
      const directory = project.directory;
      console.log(`Installing ${directory}...`);
      const install = await run(`cd ${directory} && npm install`);
      console.error(install.stderr);
      console.log(install.stdout);

      // Get all the package's dependencies...
      const runtimeDependencies = Object.keys(project.package.dependencies);
      const peerDependencies = Object.keys(project.package.peerDependencies);
      // Find the ones that are local...
      const localDependencies = [
        ...runtimeDependencies,
        ...peerDependencies
      ].filter((dependency) => packages.includes(dependency));

      // And link all of those dependencies
      for (const dependency of localDependencies) {
        console.log(`Linking ${dependency} into ${directory}...`);
        const link = await run(`cd ${directory} && npm link ${dependency}`);
        console.error(link.stderr);
        console.log(link.stdout);
      }

      // Build the package to make it ready to be linked against
      console.log(`Building ${project.package.name}...`);
      const build = await run(`cd ${directory} && npm run build`);
      console.error(build.stderr);
      console.log(build.stdout);

      // Lastly, make the project available for linking into other projects
      console.log(`Preparing ${project.package.name} for linking...`);
      const link = await run(`cd ${directory} && npm link`);
      console.error(link.stderr);
      console.log(link.stdout);
    }
    process.exit(0);
  } catch (error) {
    console.error('Failed:');
    console.error(error);
    process.exit(1);
  }
})();
