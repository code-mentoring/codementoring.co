const {Route} = require('@origami/core');

const updated = (new Date()).toISOString();

module.exports = (app, options) => {
  const r = new Route('/sitemap.xml');
  r.get((req, res, next) => {
    res.locals.content.set(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>http://www.codementoring.co/</loc>
    <lastmod>${updated}</lastmod>
  </url>
</urlset>
`);
    next();
  });

  app.useRouter(r);
}
