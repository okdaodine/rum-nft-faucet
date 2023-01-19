const router = require('koa-router')();
const db = require('../utils/db');
const _ = require('lodash');

router.get('/', list);

async function list(ctx) {
  await db.read();
  const posts = db.data.posts;
  if (~~ctx.query.limit) {
    const res = [];
    for (let i = 0; i < posts.length; i++) {
      if (res.length === ~~ctx.query.limit) {
        ctx.body = res;
        return;
      }
      if (!ctx.query.offset || i > ~~ctx.query.offset) {
        res.push(posts[i]);
      }
    }
    ctx.body = res;
  } else {
    ctx.body = posts;
  }
}

module.exports = router;