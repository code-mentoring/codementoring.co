module.exports = {
  properties: {
    id: "uuid",
    name: {type: "string", required: true},
    phone: {type: "string", required: true},
    email: {type: "string", required: true},
    stripeToken: {type: "string", required: true}
  }
}
