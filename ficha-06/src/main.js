// main.js — o arranque inteiro: cria a app, instala o router (um plugin: `use`) e monta em #app.
// The whole bootstrap: create the app, install the router (a plugin: `use`) and mount into #app.
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router.js'

createApp(App).use(router).mount('#app')
