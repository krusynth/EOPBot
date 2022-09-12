'use strict';

const config = require('../../config.js');
const { Feed } = require('feed');
const { Op } = require('sequelize');
const AWS = require('aws-sdk');

const { Document } = require('../../models');
const scrapers = require('../../lib/scrapers');

class RSS {
  serviceMap = {};
  storage = null;
  ombmemo = null;
  presaction = null;

  constructor() {
    AWS.config.setPromisesDependency(null);
    this.storage = new AWS.S3({
      endpoint: new AWS.Endpoint(config.storage.endpoint),
      accessKeyId: config.storage.key,
      secretAccessKey: config.storage.secret
    });
  }

  async notify() {
    const documents = await this.getDocuments();

    let promises = [];
    let feed;
    let params;

    params = {
      title: "EOPbot Feed",
      description: "All presidential actions, memos, etc. released in the last 30 days.",
      id: "https://billhunt.dev/blog/2021/01/25/presenting-eopbot/",
      link: "https://billhunt.dev/blog/2021/01/25/presenting-eopbot/",
      language: "en",
      // image: "http://example.com/image.png",
      // favicon: "http://example.com/favicon.ico",
      // copyright: "",
      updated: new Date(),
      generator: "EOPbot",
      feedLinks: {
        rss: "https://static.billhunt.dev/eopbot/feed/all.rss.xml",
        atom: "https://static.billhunt.dev/eopbot/feed/all.atom.xml"
      },
      author: {
        name: "Bill Hunt",
        email: "hello+eopbot@billhunt.email",
        link: "https://billhunt.dev"
      }
    };
    feed = this.buildFeed(params, documents);

    promises.push(this.storeFeed('all.rss.xml', 'application/rss+xml', feed.rss2()));
    promises.push(this.storeFeed('all.atom.xml', 'application/atom+xml', feed.atom1()));

    /* Filter for quality content */
    params = {
      title: "EOPbot Filtered Feed",
      description: "Only the key federal executive branch information from the last 30 days.",
      id: "https://billhunt.dev/blog/2021/01/25/presenting-eopbot/",
      language: "en",
      // image: "http://example.com/image.png",
      // favicon: "http://example.com/favicon.ico",
      // copyright: "",
      updated: new Date(),
      generator: "EOPbot",
      feedLinks: {
        rss: "https://static.billhunt.dev/eopbot/feed/filtered.rss.xml",
        atom: "https://static.billhunt.dev/eopbot/feed/filtered.atom.xml"
      },
      author: [{
        name: "Bill Hunt",
        email: "hello+eopbot@billhunt.email",
        link: "https://billhunt.dev"
      }]
    };
    feed = this.buildFeed(params, documents.filter(elm =>
      elm.type == 'OMB Memo' ||
      elm.type == 'OSTP Document' ||
      elm.name.substr(0, 16) == 'Executive Order '
    ));

    promises.push(this.storeFeed('filtered.rss.xml', 'application/rss+xml', feed.rss2()));
    promises.push(this.storeFeed('filtered.atom.xml', 'application/atom+xml', feed.atom1()));

    await Promise.all(promises);
  }

  async getDocuments() {
    /* Last 30 days */
    let startdate = new Date(new Date().setDate(new Date().getDate() - 30));
    startdate = startdate.toISOString().split('T')[0];

    let documents = await Document.findAll({
      where: {posted: {[Op.gte]: startdate}},
      order: [ [ 'posted', 'DESC' ]]
    });

    return documents;
  }

  buildFeed(params, documents) {
    console.log('Building', params.title, documents.length);
    let feed = new Feed(params);

    documents.forEach(doc => {
      let service = scrapers[doc.type];

      feed.addItem({
        title: doc.name,
        id: doc.url,
        link: doc.url,
        // description: doc.description,
        content: '<a href="' + doc.url + '">' + doc.url + '</a>',
        author: [{
          name: service.author,
          link: service.domain + service.url
        }],
        date: new Date(doc.posted)
      });
    });

    return feed;
  }

  async storeFeed(name, type, content) {
    return await this.storage.putObject({
      Bucket: config.storage.bucket,
      Key: config.storage.path + name,
      Body: content,
      ACL: 'public-read',
      ContentType: type
    }).promise();
  }
}

module.exports = RSS;