module.exports = {
  rules: {
    'no-restricted-imports': ['warn', { patterns: ['../*', '../../*', '../../../*'] }],
  },
};