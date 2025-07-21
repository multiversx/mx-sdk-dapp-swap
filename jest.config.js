module.exports = {
  verbose: true,
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules', 'src'],
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx|mjs)$': '@swc/jest',
    '^.+\\.scss$': 'jest-css-modules-transform',
    '\\.svg$': '<rootDir>/jestFileTransformer.js'
  },
  transformIgnorePatterns: ['node_modules/(?!(@multiversx/.*)/)'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleFileExtensions: ['js', 'ts', 'tsx', 'jsx', 'json', 'mjs'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts)x?$',
  testPathIgnorePatterns: ['\\.snap$', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2|svg)$':
      'identity-obj-proxy',
    '^(\\.{1,2}/.*)\\.js$': '$1',
    uint8arrays: '<rootDir>/node_modules/uint8arrays/cjs/src',
    multiformats: '<rootDir>/node_modules/multiformats/cjs/src',
    '^uuid$': require.resolve('uuid')
  }
};
