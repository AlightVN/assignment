module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': 'google',
  'overrides': [
  ],

  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'rules': {
    'semi': 'error',
    'max-len': ['error', { 'code': 120 }],
    'object-curly-spacing': ['error', 'always'],
  },
};
