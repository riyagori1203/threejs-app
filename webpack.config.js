const path = require('path');

const src = path.resolve(__dirname, 'src');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  target:'web',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'index.js',
    globalObject: 'window',
    path: src
  },
  devServer: {
    static: src,
  },
}