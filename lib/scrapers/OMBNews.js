'use strict';

const PresidentialAction = require('./PresidentialAction');

/***
 * Note: the meta tag for next page is missing from this page. As a result, if more than
 * a page of briefings is posted in a day, they will be missed.
 ***/

class OMBNews extends PresidentialAction {
  name = 'OMB press release';
  author = 'Office of Management and Budget';
  domain = 'https://www.whitehouse.gov/';
  url = 'omb/briefing-room/';
}

module.exports = OMBNews;