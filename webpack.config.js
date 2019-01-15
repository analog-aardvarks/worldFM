const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  entry: `${__dirname}/src/public/app/index.js`,
  output: {
    path: `${__dirname}/src/public/dist`,
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-2'],
        },
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader',
      },
    ],
  },
  plugins: [
    new CompressionPlugin({
      test: /\.js$|\.css$|\.html$/,
    }),
  ],
  // plugins: [
  //   new webpack.optimize.UglifyJsPlugin(),
  //   new webpack.optimize.AggressiveMergingPlugin(),
  // ],
};
