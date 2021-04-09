module.exports = (api) => {
  api.cache(true);

  const presets = [
    [
      '@babel/env',
      {
        targets: {
          chrome: '49',
          firefox: '45',
          safari: '9',
          edge: '12',
          ie: '11',
          ios: '10',
        },
        useBuiltIns: 'usage',
        corejs: '3.10',
        debug: false,
      },
    ],
  ];

  const plugins = [
    ['@babel/plugin-transform-runtime', { version: '^7.13.15' }],
  ];

  return {
    presets,
    plugins,
  };
};
