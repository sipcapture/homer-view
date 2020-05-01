var config = {
        // replace [apiHost ] with your api host.
        debug: true,
        apiUrl: 'http://[apiHost]/api/v3',
        apiSess: 'http://[apiHost]/api/v3/auth',
        apiAuthJWT: true,
        apiUser: 'admin',
        apiPass: 'admin',
        timeOut: 1800, // seconds
        proxyHost: '0.0.0.0',
        proxyPort: 8765
};


module.exports = config;
