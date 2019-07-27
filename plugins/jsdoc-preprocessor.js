module.exports.handlers = {
  beforeParse: function(e) {
    let typedef = /@typedef +{ *import\(.*\)} *([a-zA-Z0-9_:\. ]*)/g;

    let match = typedef.exec(e.source);

    while (match != null) {
      let [alias, jsdocValidRef] = match[1].trim().split(' ');

      // Replace all occurrances of the alias in a `@type` reference with the JSDoc reference
      // TODO: optimize so we aren't searching the entire source multiple times when replacing and matching
      e.source = e.source
        .replace(new RegExp(`@type +{${alias}}`, 'g'), `@type {${jsdocValidRef}}`)
        .replace(new RegExp(`@param +{${alias}}`, 'g'), `@param {${jsdocValidRef}}`)
        .replace(match[0], '');

      // Ignore the internal `lastIndex` so that we don't accidentilly miss any matches.
      // TODO: optimize later
      typedef.lastIndex = -1;
      match = typedef.exec(e.source);
    }
  }
};
