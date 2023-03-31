const path = require('path');
const package = require("./package.json");

module.exports = {
  mode: 'production',
  devtool: 'source-map',

  entry: './src/index.js',
  output: {
    filename: `astrochart2.v${package.version}.min.js`,
    path: path.resolve(__dirname, 'dist'),
    library: "astrology",
    libraryTarget: "umd"    
  }
}
