'use strict';

/**
 * Parse the profile.
 *
 * @param json {Object|String}
 * @returns {Object}
 * @api private
 */
exports.parse = function (json) {

  if (typeof json === 'string') {
    json = JSON.parse(json);
  }
  var profile = {};
  profile.username = json.email;
  profile.displayName = json.name;
  profile.image = json.image;
  if (json.email) {
    profile.emails = [
      { value: json.email }
    ];
  }

  return profile;
};