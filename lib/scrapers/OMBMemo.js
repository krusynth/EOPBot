'use strict';

const $ = require('cheerio');
const got = require('got');

class OMBMemo {
  name = 'OMB Memo';
  author = 'Office of Management and Budget';
  domain = 'https://www.whitehouse.gov/';
  url = '/omb/information-for-agencies/memoranda/';
  path = '.body-content > .container > .row > ul > li';

  async get() {
    try {
      let links = [];
      let dateRegex = /\( ?([A-Za-z]+ [0-9]{1,2}, ?[0-9]{4})\)?/;

      const response = await got(this.domain + this.url);
      const page = $.load(response.body);

      page(this.path).each((i, elm) => {
        elm = $(elm);

        let link = elm.children('a');

        // If this is a link to somewhere else, don't add it to the list.
        if(!link.attr('href')) return;

        if(
          (link.attr('href').substr(0, 7) == 'http://' ||
            link.attr('href').substr(0, 8) == 'https://') &&
          link.attr('href').substr(0, this.domain.length) != this.domain) {
        }
        else {
          let datetext = elm.contents().filter(function(e) {
            return this.type === 'text';
          }).text().trim();

          let match = dateRegex.exec(datetext);

          let date;
          if(match) {
            date = new Date(match[1]);
            if(isNaN(date.getTime())) {
              console.log(`Invalid date! "${match[1]}" for "${link.text()}"`);
              date = null;
            }
            else {
              // const offset = date.getTimezoneOffset()
              // date = new Date(date.getTime() - (offset*60*1000))
              date = date.toISOString().split('T')[0];
            }
          }

          links.push({
            name: link.text(),
            url: new URL(link.attr('href'), this.domain).toString(),
            type: this.name,
            posted: date
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

module.exports = OMBMemo;