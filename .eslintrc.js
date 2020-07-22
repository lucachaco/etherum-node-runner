module.exports = {
  extends: ['codfish', 'codfish/dapp'],
  rules: {
    'object-curly-spacing': ['error', 'always'],
    'no-console': 'off',
    'no-param-reassign': ['error', { props: false }],
    'jest/no-export': 0,
    'jest/no-if': 0,
    'jest/no-try-expect': 0,
    'jest/prefer-hooks-on-top': 0,
    'jest/no-commented-out-tests': 0,
    'jest/valid-title': 0,
    'jest/no-deprecated-functions': 0,
    'jest/no-conditional-expect': 0,
  },
  env: {
    node: true,
    jest: true,
    es6: true,
  },
  root: true,
};
