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

module.exports = async (req, res) => {
    const { code } = req.query;
    const options = {
        code,
        redirect_uri: `https://${req.headers.host}/api/callback`
    };

    try {
        const accessToken = await client.getToken(options);
        const token = accessToken.token.access_token;

        res.send(`
      <script>
        const receiveMessage = (message) => {
          window.opener.postMessage(
            'authorization:github:success:${JSON.stringify({
            token: token,
            provider: 'github'
        })}',
            message.origin
          );
          window.removeEventListener("message", receiveMessage, false);
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", "*");
      </script>
    `);
    } catch (error) {
        console.error('Access Token Error', error.message);
        res.status(500).json('Authentication failed');
    }
};
