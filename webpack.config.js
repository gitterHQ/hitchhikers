var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var mixins = require('postcss-sassy-mixins');
var atImport = require('postcss-import');
var simpleVars = require('postcss-simple-vars');
var forLoops = require('postcss-for-var');
var calc = require('postcss-calc');
var autoprefixer = require('autoprefixer');

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
  postcss: function() {
    return [
      simpleVars(),
      forLoops(),
      calc(),
      atImport({
        path: [
          path.resolve(__dirname, './node_modules'),
          path.resolve(__dirname, './src/css'),
        ],
      }),
      mixins(),
      autoprefixer()
    ];
  },
};
