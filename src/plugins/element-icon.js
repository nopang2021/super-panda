import * as icon from '@element-plus/icons'

export default  (app) =>{
    for (let [key, value] of Object.entries(icon)) {
        // import all icon component
        // console.log(key + ':' + value);
        app.component(key, value);
      }
}
