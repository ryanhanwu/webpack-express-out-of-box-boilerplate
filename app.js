const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const compress = require('compression')
const webpack = require('webpack')
const routes = require('./routes/index')
const config = require('./webpack.config.js')

const app = express()
const isDevelopment = app.get('env') === 'development'
app.locals.isDevelopment = isDevelopment

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(compress())
app.use(cookieParser())

// development handler
if (isDevelopment) {
  var webpackMiddleware = require('webpack-dev-middleware')
  var webpackHotMiddleware = require('webpack-hot-middleware')
  var compiler = webpack(config)
  var middleware = webpackMiddleware(compiler,
    {
      publicPath: config.output.publicPath,
      headers: {
        'X-Powered-By': 'Webpack'
      },
      stats: {
        colors: true,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false,
        modules: false
      }
    })
  app.use(middleware)
  app.use(webpackHotMiddleware(compiler))
}

//CDN failed fallback & Static files from npm
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'))
app.use('/js', express.static(__dirname + '/node_modules/barba.js/dist'))
app.use('/fonts', express.static(__dirname + '/node_modules/bootstrap/dist/fonts'))
app.use('/fonts', express.static(__dirname + '/node_modules/font-awesome/fonts'))
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'))
app.use('/css', express.static(__dirname + '/node_modules/font-awesome/css'))

app.use(express.static(path.join(__dirname, 'public')))
app.use('/', routes)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// internal server error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: isDevelopment ? err : {} // development error handlers - will print stacktrace
  })
})

module.exports = app
