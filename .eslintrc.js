module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['airbnb-base', 'airbnb-typescript/base', 'plugin:import/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-redeclare': 'off',
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'max-classes-per-file': 'off',
    'max-len': ['error', { code: 120 }],
    // 가져오기 누락시 오류
    'import/no-unresolved': 'error',
    // import 순서정의
    'import/order': [
      'error',
      {
        groups: ['builtin', 'internal', 'external', 'type', 'unknown'],
        pathGroups: [
          {
            pattern: '@nestjs/*',
            group: 'builtin',
            position: 'before',
          },
          {
            pattern: '*.controller',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '*.service',
            group: 'internal',
            position: 'after',
          },
        ],
        alphabetize: {
          order: 'asc',
        },
        'newlines-between': 'always',
      },
    ],
  },
};
