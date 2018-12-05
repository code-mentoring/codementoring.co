const {Route} = require('@origami/core');
const Stripe = require('stripe');

module.exports = (app, options) => {
  const {secret} = options;
  const stripe = new Stripe(secret);

  if (!secret) throw new Error('StripePlugin: No secret provided');


  const r = new Route('/api/v1/payment');
  r.post(async (req, res, next) => {
    const {name, phone, email, token} = req.body;

    if (!name) return next(new Error('Name is required'));
    if (!phone) return next(new Error('Phone is required'));
    if (!email) return next(new Error('Email is required'));
    if (!token) return next(new Error('Token is required'));

    const charge = await stripe.charges.create({
      amount: 49 * 100,
      currency: 'aud',
      description: 'Code Mentoring Workshop',
      source: token,
      receipt_email: email
    });

    const model = res.app.get('store').model('client');
    const client = await model.create({
      name,
      phone,
      email,
      stripeToken: token
    });

    res.locals.content.set('Successful');
    next();
  });

  app.useRouter(r);
}
