module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/lib/',
    '<rootDir>/deps/'
  ],
  verbose: true
};
