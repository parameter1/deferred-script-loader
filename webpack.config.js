const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[contenthash:8].js',
    publicPath: '', // needed for ie11
  },
  optimization: {
    // @see https://webpack.js.org/configuration/optimization/#optimizationminimize
    minimize: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: new RegExp(fs.readFileSync(path.resolve('./non_es5_node_modules'), 'utf-8').slice(1, -2)),
        loader: 'babel-loader',
      },
      { test: /\.hbs$/, loader: 'handlebars-loader' },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Deferred Scripts Sandbox',
      template: path.resolve(__dirname, 'src/index.hbs'),
      inject: false,
    }),
  ],
};
