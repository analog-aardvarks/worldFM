module.exports = {
  entry: `${__dirname}/src/public/app.jsx`,
  output: {
    path: `${__dirname}/src/dist/`,
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
};
