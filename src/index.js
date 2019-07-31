const Koa = require('koa');
const Router = require('koa-router');
const config = require('config');
const bodyparser = require('koa-bodyparser');
const Account = require('./model/account');
const AccountType = require('./model/account-type');
const accountsRepo = require('./data-access/mock/accounts-repo');
const transactionsRepo = require('./data-access/mock/transactions-repo');

const dbMiddleware = require('./data-access/connection-middleware');

const app = new Koa();
const router = new Router();

router.use(bodyparser());
router.use(dbMiddleware(config.get('database')));

router.get('/accounts', async ctx => {
  ctx.body = Array.from(Object.values(await accountsRepo.all()));
});

router.post('/accounts', async ctx => {
  let a = new Account();
  a.name = ctx.request.body.name;
  a.description = ctx.request.body.description;
  a.type = AccountType.validate(ctx.request.body.type);
  await accountsRepo.add(a);
  ctx.body = a;
});

router.get('/accounts/:id', async ctx => {
  let a = await accountsRepo.get(ctx.params.id);
  ctx.body = a;
});

app.use(router.routes());

app.use(async ctx => {
  ctx.body = 'Hello, world!';
});

app.listen(3000);
