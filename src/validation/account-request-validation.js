/** @typedef {import('koa').Middleware} KoaMiddleware koa.Middleware */
const Account = require('../model/account');

module.exports = {

  /**
   * Middleware for validating a request to create a new account.
   * 
   * @returns {KoaMiddleware} Middleware function used to validate the request.
   */
  validateCreateRequest: function() {
    return async function dispatch(ctx, next) {
      Account.validateCreateRequest(ctx.request.body);
      await next();
    }
  },

  /**
   * Middleware for validating a request to update an existing account.
   * 
   * @returns {KoaMiddleware} Middleware function used to validate the request.
   */
  validateUpdateRequest: function() {
    return async function dispatch(ctx, next) {
      Account.validateUpdateRequest(ctx.request.body);
      await next();
    }
  }

}