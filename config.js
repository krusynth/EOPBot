require('dotenv').config({path: __dirname + '/.env'});

// Since everything is in .env we don't need nested [env]s
const config = {
  env: process.env.ENV,
  db: {
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT
  },
  mail: {
    api: process.env.MAIL_API,
    from: process.env.MAIL_FROM,
    host: process.env.MAIL_HOST,
    secureConnection: process.env.MAIL_SSL !== 'false',
    port: process.env.MAIL_PORT,
    transportMethod: process.env.MAIL_METHOD,
  },
  host: {
    name: process.env.HOSTNAME,
    port: process.env.PORT
  },
  mastodon: {
    api_url: process.env.MASTODON_URI,
    access_token: process.env.MASTODON_TOKEN
  },
  storage: {
    endpoint: process.env.STORAGE_ENDPOINT,
    key: process.env.STORAGE_KEY,
    secret: process.env.STORAGE_SECRET,
    bucket: process.env.STORAGE_BUCKET,
    path: process.env.STORAGE_PATH
  }
};


if(process.env.MAIL_USER && process.env.MAIL_PASSWORD) {
  config.mail.auth = {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  };
}

// Patch for sequelize command line.
config.development = config.db;

module.exports = config;
