import { createApp } from 'vue'
import App from './App.vue'
import installElementPlus from './plugins/element'
import router from './plugins/router'
import store from './plugins/store'
import wax from './plugins/wax'
import installElementIcon from './plugins/element-icon'

const app = createApp(App).use(store).use(router).use(wax)
installElementPlus(app)
installElementIcon(app)
app.mount('#app')




