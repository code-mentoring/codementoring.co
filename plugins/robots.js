const {
  Route
} = require('@origami/core');

module.exports = (app, options) => {
  const r = new Route('/robots.txt');
  r.get((req, res, next) => {
    res.locals.content.set(`User - agent: *
Disallow:
`);
    next();
  });

  app.useRouter(r);
}
