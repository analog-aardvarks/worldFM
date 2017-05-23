
const webpack = require('webpack');

module.exports = {
  entry: `${__dirname}/src/public/app/index.js`,
  output: {
    path: `${__dirname}/src/public/dist`,
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015'],
        },
      },
    ],
  },
  // plugins: [
  //   new webpack.optimize.UglifyJsPlugin(),
  //   new webpack.optimize.AggressiveMergingPlugin(),
  // ],
};
