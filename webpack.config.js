'use strict';

const path = require('path');
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
  }
};
