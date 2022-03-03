const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const path = require('path')

module.exports = (env, argv) => ({
  mode: argv.mode === 'production' ? 'production' : 'development',
  devtool: argv.mode === 'production' ? false : 'inline-source-map',
  entry: {
    ui: './src/app/index.jsx',
    code: './src/plugin/controller.js'
  },
  module: {
    rules: [
      { test: /\.jsx?$/, use: 'babel-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, { loader: 'css-loader' }] },
      { test: /\.(png|jpg|gif|webp|svg)$/, loader: 'url-loader' }
    ]
  },
  resolve: { extensions: ['.jsx', '.js'] },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin()
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/app/index.html',
      filename: 'ui.html',
      inlineSource: '.(css|js)$',
      chunks: ['ui']
    }),
    new MiniCssExtractPlugin(),
    new HtmlWebpackInlineSourcePlugin(),
    new Dotenv({
      path: argv.mode === 'production' ? './.env.prod' : './.env.dev',
      systemvars: false
    })
  ],
  performance: {
    maxEntrypointSize: 4000000,
    maxAssetSize: 4000000
  }
})
