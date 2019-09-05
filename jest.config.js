module.exports = {
  "globals": {
    'ts-jest': {
      "tsConfig": 'tsconfig.jest.json'
    }
  },
  "preset": 'ts-jest',
  "testEnvironment": 'node',
  "moduleFileExtensions": [
    "js",
    "ts",
    "tsx"
  ],
  "transform": {
    "^.+\\.ts?(x)$": "ts-jest",
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest'
  },
  "testMatch": [
    "<rootDir>/test/**/*(*.)@(spec|test).[tj]s?(x)"
  ]
};