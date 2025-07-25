const svgrPlugin = require('esbuild-plugin-svgr');
const esbuild = require('esbuild');
const glob = require('glob');
const plugin = require('node-stdlib-browser/helpers/esbuild/plugin');
const stdLibBrowser = require('node-stdlib-browser');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

const basedir = 'src';

const buildTypes = {
  cjs: {
    splitting: false,
    format: 'cjs',
    tsconfig: './tsconfig.cjs.json',
    destination: '/__commonjs'
  },
  esm: {
    splitting: true,
    format: 'esm',
    tsconfig: './tsconfig.json',
    destination: ''
  }
};

module.exports = function esbuildWrapper(buildType = 'esm') {
  const { format, splitting, tsconfig, destination } = buildTypes[buildType];

  return function executeBuildCommand(customOptions = {}) {
    glob(
      '{./src/**/*.tsx,./src/**/*.ts,./src/**/*.scss}',
      function (err, files) {
        if (err) {
          console.log('error reading files', err);
        }

        esbuild
          .build({
            entryPoints: files,
            splitting,
            format,
            outdir: `dist${destination}`,
            treeShaking: true,
            minify: true,
            bundle: true,
            sourcemap: true,
            chunkNames: '__chunks__/[name]-[hash]',
            target: ['es2015'],
            tsconfig,
            platform: 'node',
            inject: [
              require.resolve('node-stdlib-browser/helpers/esbuild/shim')
            ],
            define: {
              global: 'global',
              process: 'process',
              Buffer: 'Buffer',
              'process.env.NODE_ENV': `"production"`
            },
            plugins: [
              svgrPlugin(),
              plugin(stdLibBrowser),
              nodeExternalsPlugin()
            ],
            ...customOptions
          })
          .then(() => {
            console.log(
              '\x1b[36m%s\x1b[0m',
              `[${new Date().toLocaleTimeString()}] sdk-dapp-swap build succeeded for ${format} types`
            );
          })
          .catch(() => process.exit(1));
      }
    );
  };
};
