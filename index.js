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

  let urls = items.map(elm => elm.url);

  let existing = await Document.findAll();

  let removedDocs = [];

  existing.forEach(elm => {
    let idx = urls.indexOf(elm.url);
    // If the doc exists, we don't need to add it.
    if(idx > -1) {
      delete urls[idx];
      delete items[idx];
    }
    // If it no longer exists, we need to remove it from our cached list.
    else {
      removedDocs.push(elm);
    }
  });

  // Remove nulls.
  items = items.filter(a => a);

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