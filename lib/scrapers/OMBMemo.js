'use strict';

const osmosis = require('osmosis');

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

      let promise = new Promise((resolve, reject) => {

        let page = osmosis.get(this.domain + this.url);
        let results = page.find(this.path).set({
          text: 'child::text()',
          title: 'a',
          url: 'a@href'
        });

        results.data(link => {

          if(!link.url) return;

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

module.exports = OMBMemo;