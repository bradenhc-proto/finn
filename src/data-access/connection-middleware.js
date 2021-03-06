const pg = require('pg');

module.exports = config => {
  const _pool = new pg.Pool(config);
  return async function(ctx, next) {
    ctx.dbconn = await _pool.connect();
    await next();
  };
};
