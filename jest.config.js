module.exports = {
  verbose: true,
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules', 'src'],
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(ts|js|tsx|jsx)$': ['@swc/jest'],
    '^.+\\.scss$': 'jest-css-modules-transform'
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleFileExtensions: ['js', 'ts', 'tsx', 'jsx', 'json', 'cjs', 'mjs'],
  testMatch: ['**/src/**/?(*.)+(spec|test).ts?(x)'],
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'identity-obj-proxy'
  },
  transformIgnorePatterns: ['node_modules/(^.+\\\\.(ts|js)$)'],
  // bail: 1,
  workerIdleMemoryLimit: '512MB', // Memory used per worker. Required to prevent memory leaks
  maxWorkers: '50%' // Maximum tests ran in parallel. Required to prevent CPU usage at 100%
};
