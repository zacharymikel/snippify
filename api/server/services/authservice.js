var passport = require('passport');

/**
 * Alias the passport.authenticate so we don't have to type all this out
 * on each secured method
 */
var secured = passport.authenticate('jwt', { session: false });
module.exports.secured = secured;