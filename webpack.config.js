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
  devtool: 'source-map',
  entry: {
    app: path.resolve(__dirname, './src/js/index.js'),
  },
  output: {
    path:          path.resolve(__dirname, './build'),
    filename:      '[name].js',
    chunkFilename: '[chunkhash].js',
    publicPath:    '/build/',
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

      //parse @import statements
      atImport({
        path: [
          path.resolve(__dirname, './node_modules'),
          path.resolve(__dirname, './src/css'),
        ],
      }),

      //added before simple vars so @mixin {name} ($var) can process $var
      mixins(),

      //parse $var: 'some-awesomeo-variable';
      simpleVars({
        variables: function() {
          return require('./config/palette.js');
        },
      }),

      //parse @for
      forLoops(),

      //parse calc();
      calc(),

      //added here to process mixins after vars have been parsed
      mixins(),

      //parse .className{ &:hover{} }
      nested(),

      //make old browsers work like a boss (kinda...)
      autoprefixer(),
    ];
  },
};
