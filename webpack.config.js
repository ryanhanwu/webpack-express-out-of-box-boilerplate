const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const isDevelopment = process.env.NODE_ENV !== 'production'
const autoprefixer = require('autoprefixer')
const sassLoaders = [
  'css-loader?sourceMap&' + (isDevelopment ? '-minimize' : 'minimize'),
  'postcss-loader',
  'sass-loader?indentedSyntax=sass&includePaths[]=' + path.resolve(__dirname, './app/styles')
]

var getEntrySources = function(sources) {
  if (isDevelopment) {
    sources.push('webpack-hot-middleware/client?reload=true')
  }
  return sources
}
var getPlugins = function() {
  var plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin('[name].min.css', {
      allChunks: true
    })
  ]
  if (isDevelopment) {
    plugins.push(new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }))
    plugins.push(new webpack.HotModuleReplacementPlugin())
    plugins.push(new webpack.NoErrorsPlugin())
  } else {
    plugins.push(new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }))
  }
  return plugins
}

module.exports = {
  devtool: isDevelopment ? 'source-map' : '',
  entry: {
    'js/global': getEntrySources([
      './app/js/global'
    ]),
    'js/page/about': getEntrySources([
      './app/js/about'
    ]),
    'css/style': getEntrySources([
      './app/styles/_index'
    ])
  },
  output: {
    path: path.join(__dirname, './public'),
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          'presets': ['react', 'es2015', 'stage-0', 'react-hmre']
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css?-minimize!postcss')
      },
      {
        test: /\.sass$/,
        loader: ExtractTextPlugin.extract('style-loader', sassLoaders.join('!'))
      }
    ]
  },
  plugins: getPlugins(),
  postcss: [
    autoprefixer({
      browsers: ['last 2 versions']
    })
  ],
  resolve: {
    extensions: ['', '.js', '.sass', '.css'],
    root: [path.join(__dirname, './')]
  }
}
