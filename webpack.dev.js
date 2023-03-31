const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',

  entry: './src/index.js',
  output: {
    filename: 'astrochart2.js',
    path: path.resolve(__dirname, 'dist'),
    library: "astrology",
    libraryTarget: 'umd'
  }
}
