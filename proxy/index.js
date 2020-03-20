/*
 * HOMER/HEPIC Auth Proxy
 * (c) QXIP BV
 * http://qxip.net
 *
 * See LICENSE for license details.
 */
var request = require('request');
var jar = request.jar();
var randomId = Math.random().toString(36).slice(2);
var homercookie = request.cookie("PCAPTURESESSION=" + randomId + ";path=/");
var homerToken;

/**********************
OPTIONS
**********************/

var _config_ = require("./config");
if (process.argv.indexOf("-c") != -1) {
    _config_ = require(process.argv[process.argv.indexOf("-c") + 1]);
}


var debug = _config_.debug || false;

function _log (/** arguments */) {
    if (debug) console.log.apply(this, arguments);
}

_log(_config_)

var apiUrl = _config_.apiUrl;
var apiSess = _config_.apiSess;
var apiUser = _config_.apiUser;
var apiPass = _config_.apiPass;
var timeOut = _config_.timeOut ? _config_.timeOut : 120;

jar.setCookie(homercookie, apiSess, function(error, cookie) {});

/**********************
FUNCTIONS
**********************/

var authCache = false;
var getAuthCookie = function(setCookie) {
    // console.log('call getAuthCookie:: ', setCookie, new Date().toLocaleString())
    if (authCache) return;
    var auth = JSON.stringify({
        "username": apiUser,
        "password": apiPass,
        "auth_type": "local"
    });
    _log(auth);
    if (setCookie) jar.setCookie(setCookie, apiSess, function(error, cookie) {});
    request({
        uri: apiSess,
        method: "POST",
        form: auth,
        jar: jar
    }, function(error, response, body) {
        if (!body) {
            _log('API Error connecting to ' + apiUrl);
            _log('Exiting...', error);
            process.exit(1);
        } else {
            _log(body);
            if (response.statusCode == 200) {
                var status = JSON.parse(body).auth;
                if (!status || status != true) {
                    _log('API Auth Failure!', status);
                    process.exit(1);
                }
                authCache = true;
            }
        }
    });

    setInterval(function() {
        authCache = false;
    }, timeOut * 1000);

    return;
}

var getAuthJWT = function() {
    if (authCache) return;
    var auth = {
        "username": apiUser,
        "password": apiPass
    };

    _log(auth);
    var headers = {
        "Authorization": 'Bearer ' + homerToken,
        "Content-Type": "application/json;charset=UTF-8"
    };
    _log('apiSess', apiSess);
    request({
        uri: apiSess,
        method: "POST",
        json: auth,
        headers: headers,
        jar: jar
    }, function(error, response, body) {
        if (!body) {
            _log('API Error connecting to ' + apiUrl);
            _log('Exiting...', error);
            process.exit(1);
        } else {
            _log(response.statusCode, body);
            if (response.statusCode == 200 || response.statusCode == 201) {
                var token = body.token;
                if (!token) {
                    _log('API Auth Failure!', token);
                    process.exit(1);
                }
                authCache = true;
                _log('new token: ', token);
                homerToken = token;
                
                return;
            }
        }
    });

    setTimeout(function() {
        authCache = false;
    }, timeOut * 1000);

    return;
}

/**********************
AUTH
**********************/

var http = require('http'),
    httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});

proxy.on('proxyReq', function(proxyReq, req, res, options) {
    proxyReq.setHeader("Access-Control-Allow-Origin", "*"); // allow requests from any other server
    proxyReq.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    proxyReq.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");

    if (req.headers && req.headers.cookie && !_config_.apiAuthJWT) {
        getAuthCookie(req.headers.cookie);
    } else if (_config_.apiAuthJWT) {
        getAuthJWT();
        if (authCache && homerToken) proxyReq.setHeader('Authorization', 'Bearer ' + homerToken);
    }
});

var server = http.createServer(function(req, res) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");

    if (req.method === 'OPTIONS') {
        console.log('OPTIONS')
        res.writeHead(200);
        res.end();
    } else {
        console.log('[PROXY]')
        proxy.web(req, res, {
            target: apiUrl
        });
    }

});

/** auth on start server, and refresh token */
setInterval (function(){
    if (_config_.apiAuthJWT) {
        getAuthJWT();
    }
}, 1000)


console.log("HOMER Proxy listening on port " + _config_.proxyPort)
server.listen(_config_.proxyPort);

