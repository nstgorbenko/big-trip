'use strict';

const path = require('path');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

const projectPath = path.join(__dirname, 'public');

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: projectPath
  },
  devtool: 'source-map',
  devServer: {
    contentBase: projectPath,
    watchContentBase: true
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new MomentLocalesPlugin()
  ]
};
