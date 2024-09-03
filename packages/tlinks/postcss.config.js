let prefixOverrideList = ['html', 'body'];
const selectorIgnoreList = [
  '.tlink',
  '.x-dark',
  '.x-light',
  '.dial-light',
  '.custom',
];

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-prefix-selector': {
      prefix: '.tlink',
      includeFiles: ['index.css'],
      transform: function (prefix, selector, prefixedSelector) {
        const shouldIgnore =
          selectorIgnoreList.filter((ignore) => selector.startsWith(ignore))
            .length > 0;
        if (shouldIgnore) {
          return selector;
        }
        if (prefixOverrideList.includes(selector)) {
          return prefix;
        } else {
          return prefixedSelector;
        }
      },
    },
  },
};
