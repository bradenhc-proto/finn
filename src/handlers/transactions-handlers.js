const transactionsRepo = require('../data-access/mock/transactions-repo');
const conversions = require('../utils/conversions');
const Transaction = require('../model/transaction');
const FinnError = require('../utils/error');
const HttpStatus = require('http-status-codes');

module.exports = {
  /**
   * Creates a new transaction.
   * 
   * @param {object} body The HTTP request body used to provide information for the transaction.
   * @returns {Promise<Transaction>} A promise resolving to the newly created account.
   */
  createNewTransactionFromBody: async function(body) {
    let t = Transaction.apply(body);
    t.unitAmount = conversions.toUnitAmount(t.amount, t.conversionFactor);
    await transactionsRepo.add(t);
    return t;
  },

  /**
   *
   * @typedef {object} TransactionQueryOptions
   * @property {string} [id] The ID of the account to fetch in the query
   *
   * @param {TransactionQueryOptions} [options] The options used to filter query results
   * @returns {Promise<Transaction[]>} A promise resolving to an array containing the query results as Account objects.
   */
  queryTransactions: async function(options) {
    let results;
    if (options && options.id) {
      results = [await transactionsRepo.get(options.id)];
    } else {
      results = await transactionsRepo.all();
    }
    return results;
  },

  /**
   *
   * @param {string} id The ID of the account to update.
   * @param {object} body The unvalidated JSON body (as an object) from the request.
   * @returns {Promise<Account>} A promise resolving to the reference to the updated Account object.
   */
  updateTransactionFromBody: async function(id, body) {
    
  }
};
