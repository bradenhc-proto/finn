const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const Account = require('../model/account');
const handlers = require('../handlers/accounts-handlers');

const router = new Router();
router.use(bodyParser());

router.get('/accounts', async ctx => {
  ctx.body = await handlers.queryAccounts();
});

router.post(
  '/accounts',
  async (ctx, next) => {
    Account.validateCreateRequest(ctx.request.body);
    await next();
  },
  async ctx => {
    await handlers.createNewAccountFromBody(ctx.request.body);
  }
);

router.get('/accounts/:id', async ctx => {
  ctx.body = await handlers.queryAccounts({ id: ctx.params.id });
});

router.patch(
  '/accounts/:id',
  async (ctx, next) => {
    Account.validateUpdateRequest(ctx.request.body);
    await next();
  },
  async ctx => {
    ctx.body = await handlers.updateAccountFromBody(ctx.params.id, ctx.request.body);
  }
);

module.exports = router;
