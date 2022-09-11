'use strict';

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const scrapers = {};

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const scraper = new (require(path.join(__dirname, file)))();

    scrapers[scraper.name] = scraper;
  });

module.exports = scrapers;
