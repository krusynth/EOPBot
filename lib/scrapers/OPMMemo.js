'use strict';

const osmosis = require('osmosis');

class OPMMemo {
  name = 'OPM Memo';
  author = 'Office of Personnel Management';
  domain = 'https://www.chcoc.gov/';
  url = '/transmittals/index.aspx';
  path = '.views-table tbody tr';

  async get() {
    try {
      let links = [];

      let promise = new Promise((resolve, reject) => {

        let page = osmosis.get(this.domain + this.url);
        let results = page.find(this.path).set({
          title: 'td[1]',
          url: 'td[1] a@href',
          date: 'td[2]'
        });

        results.data(link => {
          if(!link.url || !link.title) return;

          links.push({
            name: link.title,
            url: new URL(link.url, this.domain).toString(),
            type: this.name,
            posted: new Date(Date.parse(link.date))
          });
        });

        // results.log(console.log)
        //   .error(console.log)
        //   .debug(console.log);

        results.done(() => {
          resolve();
        });
      });

      await promise;
      // console.log('Memos:', links);

      return links;
    }
    catch (error) {
      console.log('Error', error);
    }
  }
}

module.exports = OPMMemo;