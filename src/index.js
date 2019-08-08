const Koa = require('koa');
const Router = require('koa-router');
const config = require('config');
const bodyparser = require('koa-bodyparser');
const accountsRepo = require('./data-access/mock/accounts-repo');
const Transaction = require('./model/transaction');
const transactionsRepo = require('./data-access/mock/transactions-repo');
const conversions = require('./utils/conversions');
const handlers = require('./handlers');

const dbMiddleware = require('./data-access/connection-middleware');

const app = new Koa();
const router = new Router();

router.use(bodyparser());
//router.use(dbMiddleware(config.get('database')));

router.get('/accounts', async ctx => {
  ctx.body = (await handlers.accounts.queryAccounts()).map(a => {
    delete a.unitAmount;
    return a;
  });
});

router.post('/accounts', async ctx => {
  let a = await handlers.accounts.createNewAccountFromBody(ctx.request.body);
  delete a.unitAmount;
  ctx.body = a;
});

router.get('/accounts/:id', async ctx => {
  let a = (await handlers.accounts.queryAccounts({ id: ctx.params.id }))[0];
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
    ctx.status = e.httpStatusCode || 500;
    ctx.body = {
      message: e.message,
      details: e.details || null
    };
    app.emit('error', e, ctx);
  }
});

app.on('error', (err, ctx) => {
  console.log(err);
});

app.use(router.routes());

app.listen(3000);
