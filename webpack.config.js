var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    app: path.resolve(__dirname, './src/js/index.js'),
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].js',
  },
  module: {
    loaders: [
      {
        test: /.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader'),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
  ],
  postcss: function (){
    return [];
  }
};
