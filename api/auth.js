const { AuthorizationCode } = require('simple-oauth2');

const config = {
    client: {
        id: process.env.OAUTH_CLIENT_ID,
        secret: process.env.OAUTH_CLIENT_SECRET
    },
    auth: {
        tokenHost: 'https://github.com',
        tokenPath: '/login/oauth/access_token',
        authorizePath: '/login/oauth/authorize'
    }
};

const client = new AuthorizationCode(config);

module.exports = (req, res) => {
    const authorizationUri = client.authorizeURL({
        redirect_uri: `https://${req.headers.host}/api/callback`,
        scope: 'repo,user',
        state: Math.random().toString(36).substring(7)
    });

    res.redirect(authorizationUri);
};
