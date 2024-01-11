import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

const INPUT_DIR = './src/';
const OUTPUT_DIR = './dist/';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const getPlugins = (declarationDir, minification = false) =>
  [
    typescript({
      tsconfig: IS_PRODUCTION ? './tsconfig.build.json' : './tsconfig.json',
      compilerOptions: {
        rootDir: INPUT_DIR,
        declaration: true,
        declarationDir: `${declarationDir}`,
      },
    }),
    babel({ babelHelpers: 'bundled' }),
    nodeResolve(),
    peerDepsExternal(),
    minification && terser(),
  ].filter(Boolean);

const getOutput = () => ({
  exports: 'named',
  sourcemap: true,
  preserveModules: true,
  entryFileNames: (chunkInfo) => `${chunkInfo.name.replace('src/', '')}.js`,
});

const getModule = (format) => ({
  input: `${INPUT_DIR}index.ts`,
  plugins: getPlugins(`${OUTPUT_DIR}${format}/`, IS_PRODUCTION),
  output: {
    ...getOutput(),
    format: format,
    dir: `${OUTPUT_DIR}${format}`,
  },
});

export default [getModule('es'), getModule('cjs')];
