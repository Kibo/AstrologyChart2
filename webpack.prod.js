const webpack = require('webpack');
const path = require('path');
const package = require("./package.json");
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: `astrochart2.min.js`,
    path: path.resolve(__dirname, 'dist'),
    library: "astrology",
    libraryTarget: "umd"
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
  optimization: {
    minimizer: [new TerserPlugin({
      extractComments: false
    })]
  },
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: "defaults"
              }]
            ]
          }
        }
      }, {
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
