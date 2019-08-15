const Koa = require('koa');
const accountRoutes = require('./routes/accounts-routes');
const transactionRoutes = require('./routes/transactions-routes');

const app = new Koa();

const port = 3000;

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    ctx.status = e.httpStatusCode || 500;
    ctx.body = {
      message: e.message,
      details: e.details || null
    };
    app.emit('error', e, ctx);
  }
});

app.on('error', (err, ctx) => {
  console.log(err);
});

app.use(accountRoutes);
app.use(transactionRoutes);

app.listen(port, () => {
  console.log(`Finn server is listening on port ${port}`);
});
