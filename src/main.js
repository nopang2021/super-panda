import { createApp } from 'vue'
import App from './App.vue'
import installElementPlus from './plugins/element'
import router from './plugins/router'
import store from './store'


const app = createApp(App).use(store).use(router)
installElementPlus(app)
app.mount('#app')

// Initialize ethers store
store.dispatch('ethers/init')


