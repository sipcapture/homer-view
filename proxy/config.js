var config = {
        debug: true,
        apiUrl: 'http://[your-homer-app-domain]/',
        apiSess: 'http://[your-homer-app-domain]/api/v3/auth',
        apiAuthJWT: true,
        apiUser: '[user-name]',
        apiPass: '[password]',
        timeOut: 1800, // seconds
        proxyHost: '0.0.0.0',
        proxyPort: 8765
};


module.exports = config;
