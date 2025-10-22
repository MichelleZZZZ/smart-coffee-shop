// jest.config.js
module.exports = {
    testEnvironment: 'jsdom',
    preset: 'ts-jest',
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
    transform: {
      '^.+\\.(ts|tsx)$': ['ts-jest', {
        tsconfig: 'tsconfig.jest.json',
      }],
      '^.+\\.(js|jsx)$': ['babel-jest', {
        presets: ['@babel/preset-env', '@babel/preset-react'],
      }],
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
  };
  