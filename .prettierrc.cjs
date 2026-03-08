module.exports = {
  trailingComma: 'all',
  tabWidth: 2,
  printWidth: 120,
  bracketSpacing: true,
  arrowParens: 'always',
  singleQuote: true,

  plugins: [require.resolve('@trivago/prettier-plugin-sort-imports')],

  importOrder: [
    '^react$',
    '^(react|react-dom)(.*)$',
    '^next(.*)$',
    '<THIRD_PARTY_MODULES>',
    '^@/components/(.*)$',
    '^@/hooks/(.*)$',
    '^@/utils/(.*)$',
    '^@/store/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
