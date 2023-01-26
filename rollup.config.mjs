import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

const INPUT_DIR = './src/';
const OUTPUT_DIR = './dist/';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const getPlugins = (minification = false) =>
  [
    typescript({
      tsconfig: './tsconfig.json',
      compilerOptions: {
        declaration: true,
        declarationDir: 'types',
      },
    }),
    babel({ babelHelpers: 'bundled' }),
    nodeResolve(),
    peerDepsExternal(),
    minification && terser(),
  ].filter(Boolean);

const es = {
  input: `${INPUT_DIR}index.ts`,
  plugins: getPlugins(),
  output: {
    file: `${OUTPUT_DIR}index.es.js`,
    format: 'es',
    exports: 'named',
    sourcemap: true,
  },
};

const cjs = {
  input: `${INPUT_DIR}index.ts`,
  plugins: getPlugins(true),
  output: {
    file: `${OUTPUT_DIR}index.js`,
    format: 'cjs',
    exports: 'named',
    sourcemap: true,
  },
};

const umd = {
  input: `${INPUT_DIR}index.ts`,
  plugins: getPlugins(true),
  output: {
    file: `${OUTPUT_DIR}index.umd.js`,
    format: 'umd',
    name: 'mediaprojectVk',
    exports: 'named',
    sourcemap: true,
  },
};

export default IS_PRODUCTION ? [es, cjs, umd] : umd;
