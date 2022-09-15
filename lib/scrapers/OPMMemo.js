'use strict';

// const osmosis = require('osmosis');
const Scraper = require('../Scraper');

class OPMMemo {
  name = 'OPM Memo';
  author = 'Office of Personnel Management';
  domain = 'https://www.chcoc.gov/';
  url = 'transmittals/index.aspx';
  path = '//table[contains(@class, "views-table")]/tbody/tr';

  async get() {
    try {
      let links = [];

      const scraper = new Scraper();
      let page = await scraper.get(this.domain + this.url);
      let results = page.find(this.path);

      for(const result of results) {

        let link = {
          title: result.get('td[1]/a/text()').toString(),
          url: result.get('td[1]/a/@href').value(),
          date: result.get('td[2]/span/text()').toString(),
        };

        if(!link.url || !link.title) return;

        links.push({
          name: link.title,
          url: new URL(link.url, this.domain).toString(),
          type: this.name,
          posted: new Date(Date.parse(link.date))
        });
      }

      // console.log('Memos:', links);

      return links;
    }
    catch (error) {
      console.log('Error', error);
    }
  }
}

module.exports = OPMMemo;