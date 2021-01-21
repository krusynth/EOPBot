'use strict';

const $ = require('cheerio');
const got = require('got');

class PresidentialAction {
  name = 'Presidential Action';
  domain = 'https://www.whitehouse.gov/';
  url = 'briefing-room/presidential-actions/';
  path = 'a.news-item__title';

  async get() {
    try {
      let links = [];

      const response = await got(this.domain + this.url);
      const page = $.load(response.body);

      page(this.path).each((i, elm) => {
        elm = $(elm);

        // If this is a link to somewhere else, don't add it to the list.
        if(!elm.attr('href')) return;

        if(
          (elm.attr('href').substr(0, 7) == 'http://' ||
            elm.attr('href').substr(0, 8) == 'https://') &&
          elm.attr('href').substr(0, this.domain.length) != this.domain) {
        }
        else {
          links.push({
            name: elm.text().trim(),
            url: new URL(elm.attr('href'), this.domain).toString(),
            type: this.name
          });
        }
      });

      return links;
    }
    catch (error) {
      console.log('Error', error);
    }
  }
}

module.exports = PresidentialAction;