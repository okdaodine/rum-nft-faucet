const Koa = require('koa');
const http = require('http');
const convert = require('koa-convert');
const json = require('koa-json');
const logger = require('koa-logger');
const bodyparser = require('koa-bodyparser')();
const cors = require('@koa/cors');
const router = require('koa-router')();
const serve = require('koa-static');
const views = require('koa-views');

const contract = require('./routes/contract');

const {
  errorHandler,
  extendCtx
} = require('./middleware/api');

const app = new Koa();
const port = 9001;
 
app.use(convert(bodyparser));
app.use(convert(json()));
app.use(convert(logger()));
app.use(cors({
  credentials: true
}));
app.use(views(__dirname + '/build'));
app.use(serve('build', {
  maxage: 365 * 24 * 60 * 60,
  gzip: true
}));

router.all('(.*)', errorHandler);
router.all('(.*)', extendCtx);

router.use('/favicon.ico', async (ctx) => ctx.body = true);
router.use('/api/ping', async (ctx) => ctx.body = 'pong');
router.use('/api/contracts', contract.routes(), contract.allowedMethods());

app.use(router.routes(), router.allowedMethods());

app.on('error', function (err) {
  console.log(err)
});

const server = http.createServer(app.callback());
server.listen(port, () => {
  console.log(`Node.js v${process.versions.node}`);
  console.log(`Server run at ${port}`);
});