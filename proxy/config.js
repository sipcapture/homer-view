var config = {

        // the url of my api
        apiUrl: 'http://my.api.host/api/v3/',

        // the url of my api auth
        apiSess: 'http://my.api.host/api/v3/auth',
        
        apiAuthJWT: true, //Activate for Homer7 setup
       
        apiUser: 'admin',   // api user
       
        apiPass: 'sipcapture',  // api password

        timeOut: 1800, // seconds

        //my server host where I will run the View and the Proxy
        proxyHost: 'http://my.server.host',

        // my server Proxy port
        proxyPort: 6666
};

module.exports = config;
