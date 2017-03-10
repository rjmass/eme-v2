const environment = {
  test: {
    isTest: true,
    isProduction: false,
    isDevelopment: false
  },
  development: {
    isDevelopment: true,
    isProduction: false,
    isTest: false
  },
  production: {
    isProduction: true,
    isDevelopment: false,
    isTest: false
  }
}[process.env.NODE_ENV || 'development'];

const api = process.env.API || '/api';
const urlInfix = process.env.URL_INFIX || '';

module.exports = Object.assign({
  api,
  urlInfix,
  baseUrl: urlInfix + api,
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  logLevel: process.env.LOG_LEVEL || 'info',
  dbURL: process.env.MONGOHQ_URL || 'localhost:27017/ft-email-meme-frontend-dev',
  keenProjectId: process.env.KEEN_PROJECT_ID,
  keenReadKey: process.env.KEEN_READ_KEY,
  campaignsHost: process.env.CAMPAIGNS_HOST || 'https://email-webservices.ft.com/campaigns',
  campaignsUsername: process.env.CAMPAIGNS_USERNAME || 'development',
  campaignsPassword: process.env.CAMPAIGNS_PASSWORD || 'development',
  latestNewsHost: process.env.LATEST_NEWS_HOST || 'https://email-webservices.ft.com',
  espInterceptorHost: process.env.ESP_INTERCEPTOR_HOST || 'https://email-webservices.ft.com',
  espInterceptorUsername: process.env.ESP_INTERCEPTOR_USERNAME || 'development',
  espInterceptorPassword: process.env.ESP_INTERCEPTOR_PASSWORD || 'development',
  listSendHost: process.env.LIST_SEND_HOST,
  listSendAuth: process.env.LIST_SEND_AUTH,
  sessionSecret: process.env.SESSION_SECRET || 'krMf32jFA8CjFEu2nPgt43CQ',
  awsAccessKeyId: process.env.AWS_ACCESS_KEY,
  awsSecretAccessKey: process.env.AWS_SECRET_KEY,
  awsBucket: process.env.AWS_BUCKET,
  awsSubstitutionBucket: process.env.AWS_SUBSTITUTION_BUCKET ||
  'email-platform-ftcom-permalink/substitution',
  emailSigningKey: process.env.EMAIL_SIGNING_KEY,
  app: {
    title: 'MeMe',
    description: 'Marketing Email Editor',
    head: {
      titleTemplate: 'MeMe: %s',
      meta: [
        { name: 'Toolset', content: 'Financial Times' },
        { charset: 'utf-8' },
      ]
    }
  },

}, environment);
