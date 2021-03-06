'use strict';

const { Document } = require('./models');
const OMBMemo = require('./lib/scrapers/OMBMemo');
const PresidentialAction = require('./lib/scrapers/PresidentialAction');
const { Op } = require('sequelize');
const Twitter = require('./lib/services/Twitter');

async function main() {
  const ombmemo = new OMBMemo();
  const presaction = new PresidentialAction();

  const twitter = new Twitter();

  let items = [];

  items = items.concat ( await ombmemo.get() );
  items = items.concat( await presaction.get() );

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

    // await twitter.notify('remove', removedDocs);
  }

  if(items.length) {
    let createResult = await Document.bulkCreate(items);
    console.log('Created', createResult.length);

    await twitter.notify('create', items);
  }
  else {
    console.log('No new items found.');
  }

}

main().then(() => {
  console.log('done');
  process.exit();
}).catch(error => {
  console.log('Error', error);
  process.exit();
});