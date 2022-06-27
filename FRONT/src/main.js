import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import middleware from "@grafikri/vue-middleware"
router.beforeEach(middleware())
createApp(App).use(router).mount('#app')
