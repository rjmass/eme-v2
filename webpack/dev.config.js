const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv').load({ silent: true });
const fs = require('fs');

const babelrc = fs.readFileSync('./.babelrc');
let babelrcObject = {};

try {
  babelrcObject = JSON.parse(babelrc);
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}

const babelrcObjectDevelopment = babelrcObject.env && babelrcObject.env.development || {};

// merge global and dev-only plugins
let combinedPlugins = babelrcObject.plugins || [];
combinedPlugins = combinedPlugins.concat(babelrcObjectDevelopment.plugins);

const babelLoaderQuery = Object.assign({}, babelrcObjectDevelopment, babelrcObject, { plugins: combinedPlugins });
delete babelLoaderQuery.env;

// Since we use .babelrc for client and server, and we don't want HMR enabled on the server, we have to add
// the babel plugin react-transform-hmr manually here.

// make sure react-transform is enabled
babelLoaderQuery.plugins = babelLoaderQuery.plugins || [];
let reactTransform = null;
for (let i = 0; i < babelLoaderQuery.plugins.length; ++i) {
  let plugin = babelLoaderQuery.plugins[i];
  if (Array.isArray(plugin) && plugin[0] === 'react-transform') {
    reactTransform = plugin;
  }
}

if (!reactTransform) {
  reactTransform = ['react-transform', { transforms: [] }];
  babelLoaderQuery.plugins.push(reactTransform);
}

if (!reactTransform[1] || !reactTransform[1].transforms) {
  reactTransform[1] = Object.assign({}, reactTransform[1], { transforms: [] });
}

// make sure react-transform-hmr is enabled
reactTransform[1].transforms.push({
  transform: 'react-transform-hmr',
  imports: ['react'],
  locals: ['module']
});

module.exports = {
  node: {
    fs: "empty"
  },
  context: path.resolve(__dirname, '..'),
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client',
    'bootstrap-loader',
    'font-awesome-webpack!./src/theme/font-awesome.config.js',
    './src/client.js'
  ],
  output: {
    path: path.resolve(__dirname, '../static/dist'),
    filename: 'app.js',
    publicPath: `${process.env.URL_INFIX}/dist/`
  },
  plugins: [
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
    new webpack.DefinePlugin({
      'process.env': {
        API: JSON.stringify(process.env.API),
        NODE_ENV: JSON.stringify('development'),
        URL_INFIX: JSON.stringify(process.env.URL_INFIX),
        KEEN_READ_KEY: JSON.stringify(process.env.KEEN_READ_KEY),
        KEEN_PROJECT_ID: JSON.stringify(process.env.KEEN_PROJECT_ID),
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
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
      path.resolve('./public'),
      'node_modules'
    ],
    extensions: [".json", ".js", ".scss", ".html"],
  }
};
