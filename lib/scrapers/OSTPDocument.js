'use strict';

const osmosis = require('osmosis');

class OSTPDocument {
  name = 'OSTP Document';
  author = 'Office of Science and Technology Policy';
  domain = 'https://www.whitehouse.gov/';
  url = '/ostp/reports/';
  path = '.body-content > .container > .row > p';

  async get() {
    try {
      let links = [];

      let promise = new Promise((resolve, reject) => {

        let page = osmosis.get(this.domain + this.url);
        let results = page.find(this.path).set({
          title: 'em',
          url: 'a@href',
          date: 'strong > span'
        });

        let lastDate;

        results.data(link => {
          if(link.date) {
            lastDate = new Date(Date.parse(link.date));
            return;
          }

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

module.exports = OSTPDocument;