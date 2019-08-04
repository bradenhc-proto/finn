/** @typedef {import('../../model/account')} Account module:model.Account */
const Account = require('../../model/account');
const FinnError = require('../../utils/error');
const HttpStatus = require('http-status-codes');

const accounts = {};

module.exports = {
  /**
   * Creates a new account in persistent storage, returning the new account.
   *
   * @param {Account} account The newly created account to add.
   * @returns {Promise<Account>} a promise resolving to the newly created account
   */
  add: async function(account) {
    accounts[account.id] = { ...account };
    return account;
  },

  /**
   * Fetches all accounts ordered by date.
   *
   * @param {number} [limit] The maximum number of account entries to return.
   * @param {number} [offset] The index into the dataset to start from
   * @returns {Promise<Account[]>} A promise resolving to an array of accounts that match the request.
   */
  all: async function(limit, offset) {
    if (limit === undefined) limit = -1;
    if (offset === undefined) offset = 0;
    let count = 0;
    return Array.from(Object.values(accounts))
      .filter((a, i) => i >= offset && (limit < 0 || count++ < limit))
      .map(r => {
        return Account.convert({ ...r });
      });
  },

  /**
   * Fetches an existing account with the provided ID from persistent storage.
   *
   * @param {string} id The UUID of the account to fetch
   * @returns {Promise<Account>} a promise resolving to the account
   */
  get: async function(id) {
    if (!id) {
      throw new FinnError(HttpStatus.BAD_REQUEST, 'Missing ID for account to fetch');
    }
    return Account.convert({ ...accounts[id] });
  },

  /**
   * Updates an existing account.
   *
   * @param {Account} account The account to update.
   */
  update: async function(account) {
    accounts[account.id] = { ...account };
  },

  /**
   * Removes an existing account.
   *
   * @param {string} id The UUID of the account to remove.
   * @returns {Promise<boolean>} A promise that resolves to true on success, false if the account with the provided
   * ID does not exist in the model.
   */
  remove: async function(id) {
    if (id in accounts) {
      delete accounts[id];
      return true;
    }
    return false;
  }
};
