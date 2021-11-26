import * as waxjs from "@waxio/waxjs/dist";
import * as assetjs from "atomicassets"

export default {
  install:  (app) => {
    const wax = new waxjs.WaxJS({rpcEndpoint: 'https://wax.greymass.com/', tryAutoLogin: false});
    // const wax = new waxjs.WaxJS({rpcEndpoint: 'https://wax.hkeos.com/', tryAutoLogin: false});
    const assetApi = new assetjs.ExplorerApi("https://wax.api.atomicassets.io", "atomicassets", {fetch});
    app.provide('waxjs', waxjs);
    app.provide('assetjs', assetjs);
    app.config.globalProperties.$wax = wax;
    app.config.globalProperties.$assetApi = assetApi;
    // Plugin code goes here
    // console.log('app', app);
    // console.log('wax', wax);
    // console.log('waxjs', waxjs);
    // console.log(assetApi);
    // console.log(assetjs);
  }
}


