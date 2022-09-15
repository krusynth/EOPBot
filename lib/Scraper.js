const needle = require('needle');
const libxml = require('libxmljs');

class Scraper {
  options = {
    headers: {
      user_agent: "EOPbot"
    }
  }

  constructor() {
  }

  async get(url) {
    try {
      let response = await needle('get', url, this.options);

      if(!response.body) {
        throw new Error('No document found at ' + url + ' - Status '+response.statusCode);
      }

      return libxml.parseHtmlString(response.body, {
        noblanks: true,
        recover: true
      });
    }
    catch (err) {
      console.log(err);
    }
  }

}

module.exports = Scraper;