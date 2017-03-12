require('dotenv').load({ silent: true });

const Express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const config = require('../config');
const favicon = require('serve-favicon');
const s3oAuth = require('@financial-times/s3o-middleware');
const compression = require('compression');
const path = require('path');
const template = require('lodash/template');
const logger = require('./logger');
const db = require('./db');
const { notFound, errorMiddleware } = require('./middleware/errors');
const webpack = require('webpack');
const webpackConfig = require('../../webpack/dev.config');

const authAPIRoutes = require('./routes/authRoutes');
const userAPIRoutes = require('./routes/userRoutes');
const templateAPIRoutes = require('./routes/templateRoutes');
const snippetAPIRoutes = require('./routes/snippetsRoutes');
const queriesAPIRoutes = require('./routes/queriesRoutes');
const emailAPIRoutes = require('./routes/emailRoutes');
const sendAPIRoutes = require('./routes/sendRoutes');
const savedEmailRoutes = require('./routes/savedEmailRoutes');
const imagesAPIRoutes = require('./routes/imagesRoutes');
const newsAPIRoutes = require('./routes/newsRoutes');
const campaignAPIRoutes = require('./routes/campaignRoutes');

let index;
// start db
db(config);

const app = new Express();
const compiler = webpack(webpackConfig);

if (config.isDevelopment) {
  index = fs.readFileSync(path.join(__dirname, '../../views/index.html'), 'utf8');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  app.use(webpackDevMiddleware(compiler, {
    hot: true,
    inline: true,
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }));
  app.use(webpackHotMiddleware(compiler));
} else {
  index = fs.readFileSync(path.join(__dirname, '../../static/dist/index.html'), 'utf8');
}

const indexCompiled = template(index)({ urlInfix: config.urlInfix });

// common middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(compression());
app.use(favicon(path.join(__dirname, '../..', 'static', 'favicon.ico')));

app.set('s3o-cookie-ttl', 86400000); // one day in ms
app.use(s3oAuth);
templateAPIRoutes(app);
snippetAPIRoutes(app);
queriesAPIRoutes(app);
userAPIRoutes(app);
emailAPIRoutes(app);
campaignAPIRoutes(app);
sendAPIRoutes(app);
savedEmailRoutes(app);
imagesAPIRoutes(app);
newsAPIRoutes(app);
authAPIRoutes(app);

// common index.html
app.use(config.urlInfix, Express.static(path.join(__dirname, '../..', 'static')));
app.use((req, res) => {
  res.contentType('text/html').send(indexCompiled);
});

app.use(notFound);
app.use(errorMiddleware);
config.port = (config.port || 3000);
app.listen(config.port, () => logger.info(`listening on ${config.port}`));

module.exports = app;
