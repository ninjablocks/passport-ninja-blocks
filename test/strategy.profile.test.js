'use strict';
/* global describe, it, expect, before */
/* jshint expr: true */

var NinjaBlocksStrategy = require('../lib/strategy');


describe('Strategy#userProfile', function () {

  var strategy = new NinjaBlocksStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    },
    function () {
    });

  // mock
  strategy._oauth2.get = function (url, accessToken, callback) {
    if (url != 'https://id.ninja.is/api/v1/userinfo') {
      callback(new Error('wrong url argument'));
      return;
    }
    if (accessToken != 'token') {
      callback(new Error('wrong token argument'));
      return;
    }

    var body = '{"email": "me@example.com", "nick": "me@example.com", "name": "Me Myself", "image": "http://www.gravatar.com/avatar/XXXXX?d=blank&s=200"}';

    callback(null, body, undefined);
  };

  describe('loading profile', function () {
    var profile;

    before(function (done) {
      strategy.userProfile('token', function (err, p) {
        if (err) {
          done(err);
          return;
        }
        profile = p;
        done();
      });
    });

    it('should parse profile', function () {
      expect(profile.provider).to.equal('ninja-blocks');

      expect(profile.username).to.equal('me@example.com');
      expect(profile.displayName).to.equal('Me Myself');
      expect(profile.emails).to.have.length(1);
      expect(profile.emails[0].value).to.equal('me@example.com');
    });

    it('should set raw property', function () {
      expect(profile._raw).to.be.a('string');
    });

    it('should set json property', function () {
      expect(profile._json).to.be.an('object');
    });
  });

  describe('encountering an error', function () {
    var err, profile;

    before(function (done) {
      strategy.userProfile('wrong-token', function (e, p) {
        err = e;
        profile = p;
        done();
      });
    });

    it('should error', function () {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('InternalOAuthError');
      expect(err.message).to.equal('Failed to fetch user profile');
    });

    it('should not load profile', function () {
      expect(profile).to.be.undefined;
    });
  });

});