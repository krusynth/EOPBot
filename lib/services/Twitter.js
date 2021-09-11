'use strict';

const config = require('../../config.js');
const { TwitterClient } = require('twitter-api-client');

class Twitter {
  maxlen = 256; // 280 - 23 (for the url) - 1 (a space)

  constructor() {
    this.client = new TwitterClient({
      apiKey: config.twitter.apiKey,
      apiSecret: config.twitter.apiSecret,
      accessToken: config.twitter.accessToken,
      accessTokenSecret: config.twitter.accessTokenSecret
    });
  }

  async notify(action, items) {
    for(let i = 0; i < items.length; i++) {
      let item = items[i];
      item.action = action;

      await this.send(item);
    }
  }

  async send(item) {
    let message;
    switch(item.action) {
      case 'create':
        message = `A new ${item.type} has been published: `;
        break;

      case 'remove':
        message = `An old ${item.type} has been removed: `;
        break;

      default:
        throw new Error(`Unknown notification action "${action}"`);
    }

    // We may need to truncate the name.
    let name = item.name;

    let remain = this.maxlen - message.length;
    if(name.length > remain) {
      name = name.substr(0, remain-3) + '...';
    }
    message += name + ' ' + item.url;

    let tweet = {
      status: message
    };

    if(config.env == 'production') {
      console.log(`Tweeting: "${message}"`);
      const result = await this.client.tweets.statusesUpdate(tweet);
      console.log('result: ', result);
    }
    else {
      console.log(`DRY RUN Tweet: "${message}"`);
    }
  }
}

module.exports = Twitter;