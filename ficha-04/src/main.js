// main.js — o arranque inteiro: cria a app a partir do componente raiz e monta-a em #app.
// The whole bootstrap: create the app from the root component and mount it into #app.
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')
