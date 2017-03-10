require('babel-polyfill');

// Webpack config for test
var fs = require('fs');
var dotenv = require('dotenv').config({ silent: true });
var path = require('path');
var webpack = require('webpack');
var assetsPath = path.resolve(__dirname, '../static/dist');
var host = (process.env.HOST || 'localhost');
var port = (+process.env.PORT + 1) || 3001;
var babelrc = fs.readFileSync('./.babelrc');
var babelrcObject = {};
var api = 'http://' + host + ':' + port + '/api';

try {
  babelrcObject = JSON.parse(babelrc);
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}


var babelrcObjectDevelopment = babelrcObject.env && babelrcObject.env.development || {};

// merge global and dev-only plugins
var combinedPlugins = babelrcObject.plugins || [];
combinedPlugins = combinedPlugins.concat(babelrcObjectDevelopment.plugins);

var babelLoaderQuery = Object.assign({}, babelrcObjectDevelopment, babelrcObject, { plugins: combinedPlugins });
delete babelLoaderQuery.env;

// Since we use .babelrc for client and server, and we don't want HMR enabled on the server, we have to add
// the babel plugin react-transform-hmr manually here.
// make sure react-transform is enabled
babelLoaderQuery.plugins = babelLoaderQuery.plugins || [];


module.exports = {
  node: {
    fs: "empty"
  },
  externals: {
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
    'react/addons': true
  },
  devtool: false,
  context: path.resolve(__dirname, '..'),
  entry: {
  },
  output: {
    path: assetsPath,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, '../src'),
          path.resolve(__dirname, '../node_modules/react-codemirror'),
        ],
        loaders: ['babel-loader?' + JSON.stringify(babelLoaderQuery)]
      },
      { test: /sinon.js$/, loader: "imports-loader?define=>false,require=>false" },
      { test: /\.html$/, loader: "html-loader" },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.less$/, use: [
        {
          loader: 'style-loader',
        },
        {
          loader: "css-loader", options: {
            sourceMap: true
          }
        },
        {
          loader: "less-loader", options: {
            sourceMap: true
          }
        }
      ] },
      { test: /\.scss$/, use: [
        {
          loader: 'style-loader',
        },
        {
          loader: "css-loader", options: {
            sourceMap: true
          }
        },
        {
          loader: "sass-loader", options: {
            sourceMap: true
          }
        }
      ] },
      { test: /\.css$/, loaders: ['style-loader', 'css-loader'] },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=image/svg+xml" },
    ]
  },
  resolve: {
    modules: [
      'src',
      'node_modules'
    ],
    extensions: ['.json', '.js', '.jsx']
  },
  plugins: [
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('test'),
        API: JSON.stringify(api),
        PORT: JSON.stringify(port),
        HOST: JSON.stringify(host),
        URL_INFIX: JSON.stringify('')
      }
    }),
  ]
};
