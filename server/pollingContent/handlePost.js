const db = require('../utils/db');
const rumsdk = require('rum-sdk-nodejs');
const { getSocketIo } = require('../socket');

module.exports = async (item) => {
  console.log('handle post', item);
  await db.read();
  const {
    TrxId,
    Data: {
      object: {
        id,
        content,
      }
    },
    SenderPubkey,
    TimeStamp,
  } = item;
  const post = {
    trxId: TrxId,
    id,
    content,
    userAddress: rumsdk.utils.pubkeyToAddress(SenderPubkey),
    timestamp: parseInt(String(TimeStamp / 1000000), 10)
  };
  db.data.posts.push(post);
  await db.write();
  getSocketIo().emit('post', post);
}
