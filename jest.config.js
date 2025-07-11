module.exports = {
  verbose: true,
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules', 'src'],
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.[t|j]sx?$': 'ts-jest',
    '^.+\\.scss$': 'jest-css-modules-transform',
    '\\.svg$': '<rootDir>/jestFileTransformer.js'
  },

  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleFileExtensions: ['js', 'ts', 'tsx', 'jsx', 'json'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts)x?$',
  testPathIgnorePatterns: ['\\.snap$', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2|svg)$':
      'identity-obj-proxy',
    uint8arrays: '<rootDir>/node_modules/uint8arrays/cjs/src',
    multiformats: '<rootDir>/node_modules/multiformats/cjs/src',
    '^uuid$': require.resolve('uuid')
  }
};
