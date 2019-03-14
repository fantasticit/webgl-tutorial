const path = require('path')
const merge = require('webpack-merge')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const BundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const common = require('./webpack.conf.common')

module.exports = merge(common, {
  entry: {
    index: path.resolve(__dirname, '../src/')
  },
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, '../lib'),
    filename: '[name].js',
    library: 'qchart',
    libraryExport: 'default',
    libraryTarget: 'umd'
  },
  plugins: [new BundleAnalyzer()]
})
