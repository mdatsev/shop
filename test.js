const stripe = require("stripe")("sk_test_0gAU6tNbblQnwj3ynIg4t4Mk00voPXU34K");

stripe.transfers.create({
  amount: 400,
  currency: "usd",
  destination: "acct_1F1raWDijdC7YYe8"
}, function(err, transfer) {
  console.log(err, transfer)
});

// stripe.accounts.createLoginLink(
//   'acct_1F2eJsKWxKUJ6ZNh',
//   function(err, link) {
//     console.log(err, link)
//   }
// );