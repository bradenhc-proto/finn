/** @typedef {import('koa').Middleware} KoaMiddleware koa.Middleware */
const accountsRepo = require('../data-access/mock/accounts-repo');
const conversions = require('../utils/conversions');
const Account = require('../model/account');
const FinnError = require('../utils/error');
const HttpStatus = require('http-status-codes');

module.exports = {
  /**
   * Creates a new account from an HTTP request body.
   *
   * @returns {KoaMiddleware} Middleware function used to handle the create request.
   */
  handleCreateNewAccount: function() {
    return async function(ctx) {
      let account = Account.apply({ ...new Account(), ...ctx.request.body });
      account.unitAmount = conversions.toUnitAmount(account.amount, account.conversionFactor);
      await accountsRepo.add(account);
      ctx.status = HttpStatus.CREATED;
      ctx.body = account;
    };
  },

  /**
   * Handles querying multiple records from the Account repository.
   *
   * @returns {KoaMiddleware} Middleware function used to handle the query request.
   */
  handleQueryAccounts: function() {
    return async function(ctx) {
      let results = await accountsRepo.all();
      ctx.status = HttpStatus.OK;
      ctx.body = results;
    };
  },

  /**
   * Handles fetching a single record from the Account repository.
   *
   * @returns {KoaMiddleware} Middleware function used to handle the request.
   */
  handleGetSingleAccount: function() {
    return async function(ctx) {
      let id = ctx.params.id;
      let result = accountsRepo.get(id);
      if (!result) {
        throw new FinnError(HttpStatus.NOT_FOUND, 'Account not found', `Failed to find the account with ID ${id}`);
      }
      ctx.status = HttpStatus.OK;
      ctx.body = result;
    };
  },

  /**
   *
   * @returns {KoaMiddleware} A promise resolving to the reference to the updated Account object.
   */
  handleUpdateAccount: function() {
    return async function(ctx) {
      let id = ctx.params.id;
      let body = ctx.request.body;
      let oldAccount = await accountsRepo.get(id);
      if (!oldAccount) {
        throw new FinnError(HttpStatus.NOT_FOUND, 'Failed to find account to update');
      }
      let updatedAccount = Account.apply({ ...oldAccount, ...body });
      await accountsRepo.update(updatedAccount);
      ctx.status = HttpStatus.OK;
    };
  }
};
