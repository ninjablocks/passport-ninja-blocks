'use strict';
var util = require('util');
var OAuth2Strategy = require('passport-oauth2');
var Profile = require('./profile');
var InternalOAuthError = require('passport-oauth2').InternalOAuthError;

/**
 * `Strategy` constructor.
 *
 * @param options {Object}
 * @param verify {Function}
 * @api public
 * @constructor
 */
function Strategy(options, verify) {

  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://id.ninja.is/dialog/authorize/decision';
  options.tokenURL = options.tokenURL || 'https://id.ninja.is/oauth/token';

  options.customHeaders = options.customHeaders || {};

  if (!options.customHeaders['User-Agent']) {
    options.customHeaders['User-Agent'] = options.userAgent || 'passport-ninja-blocks';
  }

  OAuth2Strategy.call(this, options, verify);
  this.name = 'ninja-blocks';
  this._userProfileURL = options.userProfileURL || 'https://id.ninja.is/api/v1/userinfo';
  this._oauth2.useAuthorizationHeaderforGET(true);
}

util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from Ninja Blocks.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `ninja-blocks`
 *   - `username`         the user's Ninja Blocks username, which is their email address.
 *   - `displayName`      the user's full name
 *   - `emails`           the user's email addresses *
 *
 * @param accessToken {String}
 * @param done {Function}
 */
Strategy.prototype.userProfile = function (accessToken, done) {
  this._oauth2.get(this._userProfileURL, accessToken, function (err, body, res) {
    var json;

    if (err) {
      done(new InternalOAuthError('Failed to fetch user profile', err));
      return;
    }

    try {
      json = JSON.parse(body);
    } catch (ex) {
      done(new Error('Failed to parse user profile'));
      return;
    }

    var profile = Profile.parse(json);
    profile.provider = 'ninja-blocks';
    profile._raw = body;
    profile._json = json;

    done(null, profile);
  });
};

module.exports = Strategy;