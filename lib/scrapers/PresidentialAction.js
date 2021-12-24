'use strict';

// const $ = require('cheerio');
// const got = require('got');
const osmosis = require('osmosis');

class PresidentialAction {
  name = 'Presidential Action';
  author = 'Executive Office of the President';
  domain = 'https://www.whitehouse.gov/';
  url = 'briefing-room/presidential-actions/';
  itemPath = 'article.news-item';
  linkPath = 'a.news-item__title';
  datePath = 'time.entry-date';
  nextPath = 'link[rel=next]';

  async get() {
    return this._get(this.domain + this.url);
  }

  async _get(url) {
    try {
      let links = [];

      let page = osmosis.get(this.domain + this.url)
        .paginate(this.nextPath, 3)

      let results = page.find(this.itemPath).set({
        title: `${this.linkPath}`,
        date: `${this.datePath}`,
        url: `${this.linkPath}@href`
      });

      let i = 0;

      let getPromise = new Promise((resolve, reject) => {

        results.then((context, link) => {

          // console.log(i++, 'Link:', link);

          let date = new Date(link.date);

          if(isNaN(date.getTime())) {
            console.log(`Invalid date! "${dateText}" for "${link.text().trim()}"`);
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

        });

        // results.log(console.log)
        //   .error(console.log)
        //   .debug(console.log);

        results.done(() => {
          resolve();
        });
      });

      await getPromise;
      // console.log('EOs:', links, links.length);

      return links;
    }
    catch (error) {
      console.log('Error', error);
    }
  }
}

module.exports = PresidentialAction;