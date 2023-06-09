const webpack = require('webpack');
const path = require('path');
const package = require("./package.json");

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',

  entry: './src/index.js',
  output: {
    filename: 'astrochart2.js',
    path: path.resolve(__dirname, 'dist'),
    library: "astrology",
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `
      ${package.name}
      ${package.description}
      Version: ${package.version}
      Author: ${package.author.name} (${package.author.email})
      Licence: GNUv3 (https://www.gnu.org/licenses/gpl-3.0.en.html)
    `
    })
  ],
  module: {
    rules: [{
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      }
    ]
  }
}
