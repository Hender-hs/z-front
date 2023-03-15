import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'

export const API_URL = "http://localhost:8000/api";
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
