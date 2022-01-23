module.exports = {
  env: {
    es2021: true,
    browser: true,
    commonjs: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 12,
    projection: ['./tsconfig.json'],
  },
  extends: ['eslint:recommended', 'alloy', 'alloy/typescript', 'plugin:prettier/recommended'],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/member-ordering': 'off',
    '@typescript-eslint/no-dynamic-delete': 'error',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/space-infix-ops': ['error', { int32Hint: false }],
    '@typescript-eslint/explicit-member-accessibility': ['error', { overrides: { constructors: 'no-public' } }],
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    curly: 'error',
    'guard-for-in': 'off',
    'no-magic-numbers': [
      'off',
      {
        ignore: [1, 0, -1],
      },
    ],
    camelcase: ['error', { properties: 'never', ignoreImports: true, ignoreDestructuring: true }],
    'no-sequences': 'off',
    'prefer-const': 'error',
    'max-params': ['warn', 4],
    radix: 'off',
    'arrow-body-style': ['error', 'as-needed'],
    'no-useless-return': 'error',
    'no-implicit-coercion': 'off',
    'no-throw-literal': 'error',
    'no-useless-concat': 'off',
  },
};
