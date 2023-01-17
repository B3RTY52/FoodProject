'use strict';

let path = require('path');

module.exports = {
  mode: 'development',
  entry: './js/script.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/js'
  },
  watch: true,

  devtool: "source-map",

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          // npm i --save-dev babel-loader
          loader: 'babel-loader',
          options: {
            // универсальный пресет:
            presets: [['@babel/preset-env', {
              debug: true,
              corejs: 3,
              // для корректной работы нужен еще один пакет - core-js
              // npm i --save-dev core-js
              useBuiltIns: "usage"
            }]]
          }
        }
      }
    ]
  }
};
