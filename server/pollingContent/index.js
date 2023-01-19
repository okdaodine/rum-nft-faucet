const rumsdk = require('rum-sdk-nodejs');
const sleep = require('../utils/sleep');
const handlePost = require('./handlePost');
const getTrxType = require('../utils/getTrxType');
const db = require('../utils/db');
const config = require('../config');
const moment = require('moment');

const LIMIT = 50;
let startTrx;

rumsdk.cache.Group.clear();
rumsdk.cache.Group.add(config.seedUrl);

module.exports = (duration) => {
  let stop = false;

  (async () => {
    await db.read();
    startTrx = db.data.startTrx;
    while (!stop) {
      try {
        const group = rumsdk.cache.Group.list()[0];
        const listOptions = {
          groupId: group.groupId,
          count: LIMIT,
        };
        
        if (startTrx) {
          listOptions.startTrx = startTrx;
        }
        const contents = await rumsdk.chain.Content.list(listOptions);
        console.log(`${moment().format('YYYY-MM-DD mm:ss')}, fetched, got ${contents.length} contents`);
        if (contents.length > 0) {
          await handleContents(contents.sort((a, b) => a.TimeStamp - b.TimeStamp));
        }
      } catch (err) {
        console.log(err);
      }
      await sleep(duration);
    }
  })();
}

const handleContents = async (contents) => {
  try {
    for (const content of contents) {
      try {
        const type = getTrxType(content);
        switch(type) {
          case 'post': await handlePost(content); break;
          default: break;
        }
        console.log(`${content.TrxId} ✅`);
      } catch (err) {
        console.log(content);
        console.log(err);
        console.log(`${content.TrxId} ❌ ${err.message}`);
      }
      await db.read();
      db.data.startTrx = content.TrxId;
      startTrx = db.data.startTrx;
      await db.write();
    }
  } catch (err) {
    console.log(err);
  }
}
