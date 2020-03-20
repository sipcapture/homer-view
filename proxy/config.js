// [HEPIC]
// var config = {
//         apiUrl: 'http://de7.sipcapture.io/',
//         apiSess: 'http://de7.sipcapture.io/api/v2/session',
//         apiAuthJWT: false, // Activate for Homer7 setup
//         apiUser: 'admin',
//         apiPass: 'garbage',
//         timeOut: 1800, // seconds
//         proxyHost: '0.0.0.0',
//         proxyPort: 8765
// };

// [HOMER]
var config = {
        debug: true,
        apiUrl: 'http://de9.sipcapture.io/',
        apiSess: 'http://de9.sipcapture.io/api/v3/auth',
        apiAuthJWT: true, // Activate for Homer7 setup
        apiUser: 'admin',
        apiPass: 'sipcapture',
        timeOut: 1800, // seconds
        proxyHost: '0.0.0.0',
        proxyPort: 8765
};


module.exports = config;
