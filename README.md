<img src="https://user-images.githubusercontent.com/1423657/39084356-c723a81e-4574-11e8-963c-d11717789fa3.png" width=200>

# HOMER-View
Stand-Alone Angular Viewer for HOMER API 7.7

![2020-03-18_16-53-40](https://user-images.githubusercontent.com/45398541/76975477-43d15280-693b-11ea-9f3e-e1d1d5c9ca4e.gif)

## Requirements
* This Application requires a Proxy like [HEP Auth Proxy](/tree/master/proxy) to access the HOMER API.

## 1 Install and configure the Proxy
1. open the proxy config from `proxy/config.js`
2. configure the proxy settings with your HOMER API parameters *(API url, username and password)*
4. start proxy: cd proxy; npm install && npm start

## 2 Install and configure the view
1. Clone this repository
2. `cd homer-view`
3. Run `npm install` to install dependencies.
4. Run `npm install -g @angular/cli` to install or update Angular CLI.
5. configure your environment with the correct `apiUrl`
6. open the `src/app/app.component.ts` and configure an save your Api user and password in:
```js
...
    ngOnInit() {
        this.authenticationService.currentUser.subscribe(async (user) => {
            if (!user) {
                /* FOR TEST API */
                await this.authenticationService.login('admin', 'siptest').pipe(first()).toPromise();
                return;
            }
...
```
6. `npm run build` to build the Stand-Alone Angular Viewer.
7. `ng serve` to serve the app.
8. Access the application at http://localhost:4200/


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
