'use strict';

const config = require('../../config.js');
const Masto = require('mastodon-api');

class Mastodon {
  maxlen = 500; // Max characters in post.
  linkLen = 23; // Magic mastodon link length.
  limit = 20;

  constructor() {
    this.client = new Masto(config.mastodon);
  }

  async notify(action, items) {
    // We only send messages up to the limit.
    const max = items.length > this.limit ? this.limit : items.length;

    for(let i = 0; i < max; i++) {
      let item = items[i];
      item.action = action;

      await this.send(item);
    }
  }

  async send(item) {
    let message;
    switch(item.action) {
      case 'create':
        message = `A new ${item.type} has been published:

`;
        break;

      case 'remove':
        message = `An old ${item.type} has been removed:

`;
        break;

      default:
        throw new Error(`Unknown notification action "${action}"`);
    }

    // We may need to truncate the name.
    let name = item.name;

    let remain = this.maxlen - (message.length + this.linkLen + 2);
    if(name.length > remain) {
      name = name.substr(0, remain-3) + '...';
    }
    message += name;

    if(item.url) {
      message += "\n\n" + item.url;
    }

    let post = {
      status: message
    };

    if(config.env == 'production') {
      console.log(`Posting: "${message}"`);
      const result = await this.client.post('statuses', post);
      if(result.resp.statusCode != 200) {
        console.log('error: ', result);
      }
    }
    else {
      console.log(`DRY RUN Toot: "${message}"`);
    }
  }
}

module.exports = Mastodon;