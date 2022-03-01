module.exports = (api) => {
  api.cache(true);

  const presets = [
    [
      '@babel/env',
      {
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
