module.exports = {
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'next/core-web-vitals',
  ],
  rules: {
    'react/no-unescaped-entities': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    '@next/next/no-img-element': 'warn',
  },
  settings: {
    react: {
      version: '18',
    },
  },
  ignorePatterns: ['node_modules/', '.next/', 'out/', '*.config.js', 'scripts/'],
};
