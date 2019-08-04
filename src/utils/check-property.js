const FinnError = require('./error');
const HttpStatus = require('http-status-codes');

/**
 * Checks for existance of a property on an object and takes appropriate action depending on if the object is being
 * newly created or not.
 * 
 * @param {string} propName The name of the property to validate.
 * @param {object} obj The object to validate the property on.
 * @param {boolean} isNew Indicates whether the validation is for a new object or an existing one.
 * @param {function} defaultFunc The function to execute to set the default value for the property on the object.
 * @throws {FinnError} When property validation fails. The error will contain detailed information about why the failure
 * occurred.
 */
function checkProperty(propName, obj, isNew, defaultFunc) {
  if(obj[propName] === undefined) {
    if(isNew) {
      obj[propName] = defaultFunc();
    } else {
      throw new FinnError(
        HttpStatus.BAD_REQUEST,
        'Missing property value on request to create new transaction',
        `The request must contain a value for the "${propName}" field`
      );
    }
  } else {
    if(isNew) {
      throw new FinnError(
        HttpStatus.BAD_REQUEST,
        'Invalid property value for request to create transaction',
        `The request cannot contain a value for the "${propName}" field`
      );
    }
  }
}


module.exports = checkProperty;