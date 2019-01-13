const {
  Route
} = require('@origami/core');

module.exports = (app, options) => {
  // Don't enforce locally
  if (process.env.NODE_ENV === 'DEVELOPMENT') return;

  const r = new Route('*');
  r.use((req, res, next) => {
    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
      return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
  });

  app.useRouter(r);
}
