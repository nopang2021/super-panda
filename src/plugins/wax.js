import * as waxjs from "@waxio/waxjs/dist";

export default {
  install:  (app) => {
    const wax = new waxjs.WaxJS({rpcEndpoint: 'https://wax.greymass.com', tryAutoLogin: false});
    app.provide('waxjs', waxjs);
    app.config.globalProperties.$wax = wax;
    // Plugin code goes here
    // console.log('app', app);
    // console.log('wax', wax);
    // console.log('waxjs', waxjs);
  }
}


