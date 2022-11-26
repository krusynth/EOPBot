'use strict';

const { Document } = require('./models');
const scrapers = require('./lib/scrapers');
const { Op } = require('sequelize');
const Mastodon = require('./lib/services/Mastodon');
const RSS = require('./lib/services/RSS');

async function main() {
  const mastodon = new Mastodon();
  const rss = new RSS();

  let items = [];
  let last = 0;

  for(const [name, scraper] of Object.entries(scrapers)) {
    items = items.concat(await scraper.get());
    console.log('Scraping ' + name + ' - found ' + (items.length - last));
    last = items.length;
  }

  // Create a hash map
  let urls = items.reduce((acc, elm) => {
    if(!acc[elm.url]) {
      acc[elm.url] = [];
    }
    acc[elm.url].push(elm);

    return acc;
  }, {});


  let existing = await Document.findAll();

  let removedDocs = [];

  existing.forEach(elm => {
    // If the doc exists, we don't need to add it.
    if(urls[elm.url]) {
      delete urls[elm.url];
    }
    // If it no longer exists, we need to remove it from our cached list.
    else {
      removedDocs.push(elm);
    }
  });

  // Convert our hash back to a list.
  items = [];
  let keys = Object.keys(urls);

  for(let i = 0; i < keys.length; i++) {
     items = items.concat(urls[keys[i]]);
  }

  if(removedDocs.length) {
    let ids = removedDocs.map(elm => elm.id);

    // let destroyResult = await Document.destroy({where: {id: {[Op.in]: ids}}});
    // console.log('Destroyed', destroyResult);

    // await mastodon.notify('remove', removedDocs);
  }

  if(items.length) {
      let createResult = await Document.bulkCreate(items);
      console.log('Created', createResult.length);

    if(items.length < 20) {
      await mastodon.notify('create', items);
      await rss.notify();
    }
    else {
      console.log('An error has occurred. A page may have changed!!!');
      console.log(items);
    }

  }
  else {
    console.log('No new items found.');
  }
  /* begin testing */
  // console.log("Test RSS");
  // await rss.notify();
  /* end testing */
}

main().then(() => {
  console.log('done');
  process.exit();
}).catch(error => {
  console.log('Error', error);
  process.exit();
});
