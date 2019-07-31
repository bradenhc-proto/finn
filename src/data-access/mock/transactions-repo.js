const Transaction = require('../../model/transaction');

const transactions = {};

module.exports = {
  /**
   * Adds a new transaction to persistent storage.
   *
   * @param {Transaction} transaction The transaction to add.
   * @returns {Promise<Transaction>} A promise resolving to the newly created account
   */
  add: async function(transaction) {
    transactions[transaction.id] = transaction;
    return transaction;
  },

  /**
   * Fetches all transactions ordered by date.
   * 
   * @param {number} [limit] The maximum number of transaction entries to return.
   * @param {number} [offset] The index into the dataset to start from
   * @returns {Promise<Transaction[]>} A promise resolving to an array of transactions that match the request.
   */
  all: async function(limit, offset) {
    if (limit === undefined) limit = -1;
    if (offset === undefined) offset = 0;
    let count = 0;
    return Array.from(Object.values(transactions)).filter((v, i) => i >= offset && (limit < 0 || count++ < limit));
  },

  /**
   * Fetches an existing transaction with the provided ID from persistent storage.
   *
   * @param {string} id The UUID of the transaction to fetch
   * @returns {Promise<Transaction>} A promise resolving to the transaction
   */
  get: async function(id) {
    if (!id) {
      throw new Error('Missing ID for account to fetch');
    }
    return transactions[id];
  },

  /**
   * Updates an existing transaction.
   *
   * @param {Transaction} transaction The transaction to update.
   */
  update: async function(transaction) {
    transactions[transaction.id] = transaction;
  },

  /**
   * Removes an existing transaction.
   * 
   * @param {string} id The UUID of the transaction to remove.
   * @returns {Promise<boolean>} A promise that resolves to true on success, false if the transaction with the provided
   * ID does not exist in the model.
   */
  remove: async function(id) {
    if (id in transactions) {
      delete transactions[id];
      return true;
    }
    return false;
  }
};
