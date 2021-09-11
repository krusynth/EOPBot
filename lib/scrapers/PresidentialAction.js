'use strict';

const $ = require('cheerio');
const got = require('got');

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

      const response = await got(url);
      const page = $.load(response.body);

      page(this.itemPath).each((i, elm) => {
        elm = $(elm);

        let link = elm.find(this.linkPath);
        let dateText = elm.find(this.datePath).text().trim();

        let date = new Date(dateText);
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
        if(!link.attr('href')) return;

        if(
          (link.attr('href').substr(0, 7) == 'http://' ||
            link.attr('href').substr(0, 8) == 'https://') &&
          link.attr('href').substr(0, this.domain.length) != this.domain) {
        }
        else {
          links.push({
            name: link.text().trim(),
            url: new URL(link.attr('href'), this.domain).toString(),
            type: this.name,
            posted: date
          });
        }
      });

      let next = page(this.nextPath)
      if(next.length && $(next[0]).attr('href')) {
        links = links.concat(await this._get( $(next[0]).attr('href') ));
      }

      return links;
    }
    catch (error) {
      console.log('Error', error);
    }
  }
}

module.exports = PresidentialAction;