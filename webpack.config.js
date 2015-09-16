var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var mixins       = require('postcss-sassy-mixins');
var atImport     = require('postcss-import');
var simpleVars   = require('postcss-simple-vars');
var forLoops     = require('postcss-for-var');
var calc         = require('postcss-calc');
var autoprefixer = require('autoprefixer');
var nested       = require('postcss-nested');

module.exports = {
  entry: {
    app: path.resolve(__dirname, './src/js/index.js'),
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].js',
    publicPath: '/build/',
  },
  module: {
    loaders: [
      {
        test:    /.css$/,
        include: path.resolve(__dirname, './src/css'),
        loader:  ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader'),
      },
      {
        test:    /.js$/,
        include: path.resolve(__dirname, './src/js'),
        loader:  'babel-loader',
      },
      {
        test:    /.svg$/,
        include: path.resolve(__dirname, './src/svg'),
        loader:  'file-loader',
      },
      {
        test:    /.hbs$/,
        include: path.resolve(__dirname, './src/templates'),
        loader:  'handlebars-loader',
        query:   {
          //helpers
        },
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
  ],
  resolve: {
    alias: {
      svg: path.resolve(__dirname, './src/svg'),
    },
  },
  postcss: function() {
    return [
      atImport({
        path: [
          path.resolve(__dirname, './node_modules'),
          path.resolve(__dirname, './src/css'),
        ],
      }),
      nested(),
      simpleVars({
        variables: function() {
          return require('./config/palette.js');
        },
      }),
      forLoops(),
      calc(),
      mixins(),
      autoprefixer(),
    ];
  },
};
