const Koa = require('koa');
const Router = require('koa-router');
const config = require('config');
const bodyparser = require('koa-bodyparser');
const Account = require('./model/account');
const AccountType = require('./model/account-type');
const accountsRepo = require('./data-access/mock/accounts-repo');
const Transaction = require('./model/transaction');
const TransactionType = require('./model/transaction-type');
const transactionsRepo = require('./data-access/mock/transactions-repo');
const conversions = require('./utils/conversions');

const dbMiddleware = require('./data-access/connection-middleware');

const app = new Koa();
const router = new Router();

router.use(bodyparser());
//router.use(dbMiddleware(config.get('database')));

router.get('/accounts', async ctx => {
  ctx.body = await accountsRepo.all();
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

router.get('/transactions', async ctx => {
  ctx.body = await transactionsRepo.all();
});

router.post('/transactions', async ctx => {
  let t = new Transaction();
  t.type = TransactionType.validate(ctx.request.body.type);
  t.unitAmount = conversions.toUnitAmount(ctx.request.body.amount);
  t.details = ctx.request.body.details;
  t.sourceAccount = ctx.request.body.source;
  t.targetAccount = ctx.request.body.target;
  await transactionsRepo.add(t);
  let source = t.sourceAccount ? await accountsRepo.get(t.sourceAccount) : null;
  let target = await accountsRepo.get(t.targetAccount);
  t.execute(target, source);
  source && await accountsRepo.update(source);
  target && await accountsRepo.update(target);
  ctx.body = t;
});

router.get('/transactions/:id', async ctx => {
  ctx.body = await transactionsRepo.get(ctx.params.id);
});

app.use(router.routes());

app.use(async ctx => {
  ctx.body = 'Hello, world!';
});

app.listen(3000);
