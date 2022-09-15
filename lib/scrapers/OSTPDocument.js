'use strict';

// const osmosis = require('osmosis');
const Scraper = require('../Scraper');

class OSTPDocument {
  name = 'OSTP Document';
  author = 'Office of Science and Technology Policy';
  domain = 'https://www.whitehouse.gov/';
  url = 'ostp/reports/';
  path = '//section[contains(@class, "body-content")]/div[contains(@class, "container")]/div[contains(@class, "row")]/p';

  async get() {
    try {
      let links = [];

        const scraper = new Scraper();
        let page = await scraper.get(this.domain + this.url);
        let results = page.find(this.path);

        let lastDate;

        for(const result of results) {
          if(result.get('strong/span')) {
            lastDate = new Date(Date.parse(result.get('strong/span/text()'.toString())));
            continue;
          }
          if(!result.get('em')) {
            continue;
          }

          let link = {
            title: result.get('string(em)').toString(),
            url: result.get('a/@href').value(),
            date: lastDate
          };
          // console.log(link);

          if(!link.url || !link.title) return;

          if(
            (link.url.substr(0, 7) == 'http://' ||
              link.url.substr(0, 8) == 'https://') &&
            link.url.substr(0, this.domain.length) != this.domain) {
          }
          else {
            links.push({
              name: link.title,
              url: new URL(link.url, this.domain).toString(),
              type: this.name,
              posted: lastDate
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

module.exports = OSTPDocument;