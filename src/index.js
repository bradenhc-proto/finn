const Koa = require('koa');
const Router = require('koa-router');
const config = require('config');
const bodyparser = require('koa-bodyparser');
const Account = require('./model/account');
const accountsRepo = require('./data-access/mock/accounts-repo');
const Transaction = require('./model/transaction');
const transactionsRepo = require('./data-access/mock/transactions-repo');
const conversions = require('./utils/conversions');

const dbMiddleware = require('./data-access/connection-middleware');

const app = new Koa();
const router = new Router();

router.use(bodyparser());
//router.use(dbMiddleware(config.get('database')));

router.get('/accounts', async ctx => {
  ctx.body = (await accountsRepo.all()).map( a => {
    delete a.unitAmount;
    return a;
  });
});

router.post('/accounts', async ctx => {
  ctx.request.body.unitAmount = conversions.toUnitAmount(ctx.request.body.amount || '0.00');
  let a = Account.convert(ctx.request.body, true);

  await accountsRepo.add(a);

  a.amount = conversions.fromUnitAmount(a.unitAmount);
  delete a.unitAmount;
  ctx.body = a;
});

router.get('/accounts/:id', async ctx => {
  let a = await accountsRepo.get(ctx.params.id);
  delete a.unitAmount;
  ctx.body = a;
});

router.get('/transactions', async ctx => {
  ctx.body = await transactionsRepo.all();
});

router.post('/transactions', async ctx => {
  ctx.request.body.unitAmount = conversions.toUnitAmount(ctx.request.body.amount);
  let t = Transaction.convert(ctx.request.body, true);

  await transactionsRepo.add(t);

  let source = t.sourceAccountId ? await accountsRepo.get(t.sourceAccountId) : null;
  let target = await accountsRepo.get(t.targetAccountId);
  t.execute(target, source);

  source && (await accountsRepo.update(source));
  target && (await accountsRepo.update(target));

  t.isCompleted = true;
  await transactionsRepo.update(t);

  t.amount = conversions.fromUnitAmount(t.unitAmount);
  delete t.unitAmount;
  ctx.body = t;
});

router.get('/transactions/:id', async ctx => {
  ctx.body = await transactionsRepo.get(ctx.params.id);
});

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
    ctx.status = e.httpStatusCode || e.status;
    ctx.body = {
      message: e.message
    };
    app.emit('error', e, ctx);
  }
});

app.on('error', (err, ctx) => {
  console.log(err);
});

app.use(router.routes());

app.use(async ctx => {
  ctx.body = 'Hello, world!';
});

app.listen(3000);
