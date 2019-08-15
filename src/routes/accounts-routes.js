const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const validation = require('../validation/account-request-validation');
const handlers = require('../handlers/accounts-handlers');

const router = new Router();
router.use(bodyParser());

router.get('/accounts', handlers.handleQueryAccounts());

router.post('/accounts', validation.validateCreateRequest(), handlers.handleCreateNewAccount());

router.get('/accounts/:id', handlers.handleGetSingleAccount());

router.patch('/accounts/:id', validation.validateUpdateRequest(), handlers.handleUpdateAccount());

module.exports = router.routes();
