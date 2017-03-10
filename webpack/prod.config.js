require('dotenv').load({ silent: true });

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
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

const combinedPlugins = babelrcObject.plugins || [];
const babelLoaderQuery = Object.assign(babelrcObject, { plugins: combinedPlugins });
delete babelLoaderQuery.env;

module.exports = {
  node: {
    fs: 'empty'
  },
  context: path.resolve(__dirname, '..'),
  devtool: false,
  entry: [
    'bootstrap-loader/extractStyles',
    'font-awesome-webpack!./src/theme/font-awesome.config.js',
    './src/client.js'
  ],
  output: {
    path: path.resolve(__dirname, '../static/dist'),
    filename: 'app-[hash].js',
    publicPath: `${process.env.URL_INFIX}/dist/`
  },
  plugins: [
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
    new webpack.DefinePlugin({
      'process.env': {
        API: JSON.stringify(process.env.API),
        URL_INFIX: JSON.stringify(process.env.URL_INFIX),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        KEEN_READ_KEY: JSON.stringify(process.env.KEEN_READ_KEY),
        KEEN_PROJECT_ID: JSON.stringify(process.env.KEEN_PROJECT_ID)
      }
    }),
    // optimizations
    new webpack.optimize.OccurrenceOrderPlugin(),
    new ExtractTextPlugin('[name]-[hash].css'),
    // new webpack.optimize.UglifyJsPlugin()
    // add hashes to index html
    function() {
      this.plugin("done", function(statsData) {
        const stats = statsData.toJson();

        if (!stats.errors.length) {
          const htmlFileName = 'index.html';
          let html = fs.readFileSync(path.join(__dirname, '../views', htmlFileName), 'utf8');
          let htmlOutput = html
            .replace(/dist\/main\.css/, `dist/main-${stats.hash}.css`)
            .replace(/dist\/app\.js/, `dist/app-${stats.hash}.js`);

          fs.writeFileSync(path.join(__dirname, '../static/dist', htmlFileName), htmlOutput);
        }

      })
    }
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
      { test: /\.html$/, loader: 'html-loader' },
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /\.less/, use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader']
        })
      },
      {
        test: /\.scss$/, use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.css$/, use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader']
        })
      },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml' },
    ]
  },
  resolve: {
    modules: [
      'src',
      path.resolve('./public'),
      'node_modules'
    ],
    extensions: ['.json', '.js', '.scss', '.html']
  }
};
