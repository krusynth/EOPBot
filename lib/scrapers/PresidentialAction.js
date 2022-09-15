'use strict';

// const $ = require('cheerio');
// const got = require('got');
// const osmosis = require('osmosis');
const Scraper = require('../Scraper');

class PresidentialAction {
  name = 'Presidential Action';
  author = 'Executive Office of the President';
  domain = 'https://www.whitehouse.gov/';
  url = 'briefing-room/presidential-actions/';

  linkPath = 'a[contains(@class, "news-item__title")]';
  nextPath = '//link[contains(@rel, "next")]/@href';
  maxPages = 5;

  async get() {
    try {
      let url = this.domain + this.url;
      let links = [];
      let i = 0;

      const scraper = new Scraper();

      for(let i = 0; i < this.maxPages; i++) {
        let page = await scraper.get(url);

        let results = page.find('//article[contains(@class, "news-item")]');
        // console.log('count', results.length);

        for(const result of results) {
          let link = {};
          const a = result.get('//h2/a[contains(@class,  "news-item__title")]');

          link.title = a.get('child::text()').toString();
          link.url = a.get('@href').value();
          link.date = result.get('//time[contains(@class, "entry-date")]/@datetime').value();

          let date = new Date(link.date);

          if(isNaN(date.getTime())) {
            console.log(`Invalid date! "${link.date}" for "${link.title}"`);
            date = null;
          }
          else {
            // const offset = date.getTimezoneOffset()
            // date = new Date(date.getTime() - (offset*60*1000))
            date = date.toISOString().split('T')[0];
          }

          // If this is a link to somewhere else, don't add it to the list.
          if(!link.url) return;

          if(
            (link.url.substr(0, 7) == 'http://' ||
              link.url.substr(0, 8) == 'https://') &&
            link.url.substr(0, this.domain.length) != this.domain) {
          }
          else {
            links.push({
              name: link.title.trim(),
              url: new URL(link.url, this.domain).toString(),
              type: this.name,
              posted: date
            });
          }
        }

        let nextUrl = page.get(this.nextPath);

        if(!nextUrl) { break; }
        url = nextUrl.value();
      }

      // console.log('EOs:', links, links.length);

      return links;
    }
    catch (error) {
      console.log('Error', error);
    }
  }
}

module.exports = PresidentialAction;