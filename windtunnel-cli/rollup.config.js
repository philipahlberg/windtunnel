import common from '../rollup.config.js';
import pkg from './package.json';

const dependencies = Object.keys(pkg.dependencies);

export default {
  ...common,
  output: {
    ...common.output,
    banner: '#!/usr/bin/env node',
  },
  external: [
    ...common.external,
    ...dependencies,
  ],
};
