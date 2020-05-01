<img src="https://user-images.githubusercontent.com/1423657/39084356-c723a81e-4574-11e8-963c-d11717789fa3.png" width=200>

# HOMER-View

Stand-Alone Angular Viewer for HOMER API 7.7

![2020-03-18_16-53-40](https://user-images.githubusercontent.com/45398541/76975477-43d15280-693b-11ea-9f3e-e1d1d5c9ca4e.gif)

## Requirements

* This Application requires a Proxy like [HEP Auth Proxy](https://github.com/sipcapture/homer-view/tree/master/proxy) to access the HOMER API.

## 1 Install and configure the Proxy

1. open the proxy config from `proxy/config.js`


2. configure the proxy settings with your HOMER API parameters and the server you want to Proxy the API as shown:

```js
...
var config = {

        // the url of my api
        apiUrl: 'http://[Api Host]/api/v3/',

        // the url of my api auth
        apiSess: 'http://[Api Host]/api/v3/auth',
        
        apiAuthJWT: true, //Activate for Homer7 setup
       
        apiUser: '[api-user]',   // api user
       
        apiPass: '[api-pass]',  // api password

        timeOut: 1800, // seconds

        //my server host where I will run the View and the Proxy
        proxyHost: '[my Homer-view host]',

        // my server Proxy port
        proxyPort: 8765
};

module.exports = config;
...
```

4. start proxy: cd proxy; npm install && npm start ( The proxy will start in the Port you specified, so be sure that you have that port available for the Proxy )


## 2 Install and configure the view

1. `cd homer-view`

2. Run `npm install` to install dependencies.

3. Run `npm install -g @angular/cli` to install or update Angular CLI.


4. configure your `environment.ts` with the correct `apiUrl`

```js
...
import { VERSION } from '../VERSION';
export const environment = {
  production: false,
  environment: VERSION + '(dev)',
  /* MY URL with proxy port*/
  apiUrl: 'http://my.host:8765'
};

...
```

5. `npm run build` to build the Stand-Alone Angular Viewer. Or just jump to next step for running with the default environment.

6. `ng serve --host=my.server.host --port=4200` to serve the app replacing the `4200` with the port and `my.server.host` with the host you will use for the Homer-view. 

7. Access the application at `http://my.server.host:4200/`

8. Test the Homer-view app with the parameters of a call stored in your server.

#### Example
* `http://localhost:4200/?id=16697926&callid=3orfbk@127.0.0.1&from=1574632800000&to=1577224799000`

9. If you have errors in the console it should be because now the `?id=` param is needed. And the queries you made before are stored on local storage.

Just clean local storage and refresh the browser.

### URL Parameters
The Application accepts the following URL parameters defining search settings 


 **Required** 
* `id`: id string or array
* `callid`: callid string or array
* `from`: start time in milliseconds
* `to`: stop time in milliseconds

**Optional**
* `tabs`: visibile tabs, options
  * messages
  * qos
  * flow
  * logs
  * export


#### Example
* `http://localhost:4200/?id=16697926&callid=3orfbk@127.0.0.1&from=1574632800000&to=1577224799000`


-------------

#### Made by Humans
This Open-Source project is made possible by actual Humans without corporate sponsors, angels or patreons.<br>
If you use this software in production, please consider supporting its development with contributions or [donations](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=donation%40sipcapture%2eorg&lc=US&item_name=SIPCAPTURE&no_note=0&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHostedGuest)

[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=donation%40sipcapture%2eorg&lc=US&item_name=SIPCAPTURE&no_note=0&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHostedGuest) 

