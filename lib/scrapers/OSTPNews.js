'use strict';

const PresidentialAction = require('./PresidentialAction');

/***
 * Note: the meta tag for next page is missing from this page. As a result, if more than
 * a page of briefings is posted in a day, they will be missed.
 ***/

class OSTPNews extends PresidentialAction {
  name = 'OSTP update';
  author = 'Office of Science and Technology Policy';
  domain = 'https://www.whitehouse.gov/';
  url = 'ostp/news-updates/';
}

module.exports = OSTPNews;