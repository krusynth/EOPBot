'use strict';

// const osmosis = require('osmosis');
const Scraper = require('../Scraper');

class OMBMemo {
  name = 'OMB Memo';
  author = 'Office of Management and Budget';
  domain = 'https://www.whitehouse.gov';
  url = '/omb/information-for-agencies/memoranda/';
  path = '//section[contains(@class, "body-content")]/div[contains(@class, "container")]/div[contains(@class, "row")]';

  async get() {
    try {
      let links = [];
      let dateRegex = /\( ?([A-Za-z]+ [0-9]{1,2}, ?[0-9]{4})\)?/;

      const scraper = new Scraper();
      let page = await scraper.get(this.domain + this.url);

      let results = page.get(this.path).find('ul/li');

      for(const result of results) {
        let link = {};
        const a = result.get('a');

        link.title = a.get('child::text()').toString();
        link.url = a.get('@href').value();
        link.text = result.get('child::text()').toString();

        if(!link.url) continue;

        if(
          (link.url.substr(0, 7) == 'http://' ||
            link.url.substr(0, 8) == 'https://') &&
          link.url.substr(0, this.domain.length) != this.domain) {
        }
        else {
          let match = dateRegex.exec(link.text);

          let date;
          if(match) {
            date = new Date(match[1]);
            if(isNaN(date.getTime())) {
              console.log(`Invalid date! "${match[1]}" for "${link.text}"`);
              date = null;
            }
            else {
              // const offset = date.getTimezoneOffset()
              // date = new Date(date.getTime() - (offset*60*1000))
              date = date.toISOString().split('T')[0];
            }
          }

          links.push({
            name: link.title,
            url: new URL(link.url, this.domain).toString(),
            type: this.name,
            posted: date
          });
        }
      }

      // console.log('Memos:', links);

      return links;
    }
    catch (error) {
      console.log('Error', error);
    }
  }
}

module.exports = OMBMemo;