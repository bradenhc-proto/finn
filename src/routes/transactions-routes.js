const Router = require('@koa/router');
const transactionsHandler = require('../handlers/transactions-handlers');
const Transaction = require('../model/transaction');
const bodyParser = require('koa-bodyparser');

const router = new Router();

router.use(bodyParser());

router.get('/transactions', async ctx => {
  ctx.body = await transactionsHandler.queryTransactions();
});

router.post('/transactions', async (ctx, next) => {
  Transaction.validateCreateRequest(ctx.request.body);
  await next();
}, async ctx => {
  let t = await transactionsHandler.createNewTransactionFromBody(ctx.request.body);
  ctx.body = t;
});

module.exports = router.routes();