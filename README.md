# passport-ninja-blocks

[Passport](http://passportjs.org/) strategy for authenticating with [Ninja Blocks](https://ninjablocks.com/)
using the OAuth 2.0 API.

## Install

```
npm install passport-github
```

# Usage

```javascript
passport.use(new GitHubStrategy({
        clientID: NINJA_CLIENT_ID,
        clientSecret: NINJA_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/ninja/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ username: profile.username }, function (err, user) {
            return done(err, user);
        });
    }
));
```

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2014 Ninja Blocks <[http://ninjablocks.com/](http://ninjablocks.com/)>