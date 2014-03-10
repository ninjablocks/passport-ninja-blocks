'use strict';
/* global describe, it, expect */
/* jshint expr: true */

var fs = require('fs');
var parse = require('../lib/profile').parse;


describe('profile.parse', function () {

  describe('example profile', function () {
    var profile;

    before(function (done) {
      fs.readFile('test/data/profile.json', 'utf8', function (err, data) {
        if (err) {
          done(err);
          return;
        }
        profile = parse(data);
        done();
      });
    });

    it('should parse profile', function () {
      expect(profile.username).to.equal('me@example.com');
      expect(profile.displayName).to.equal('Me Myself');
      expect(profile.emails).to.have.length(1);
      expect(profile.emails[0].value).to.equal('me@example.com');
    });
  });

});