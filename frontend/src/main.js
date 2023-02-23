import { createApp } from 'vue' // Импорт метода для создания приложения
import App from './App.vue' // Импорт главного компонента
import router from './router' // Маршрутизация
import 'bootstrap/dist/css/bootstrap.css' // Подключение Bootstrap
import store from './store';
import moment from 'moment'
moment.locale('ru');

const app = createApp(App); // Создание экземпляра приложения
app.config.globalProperties.$moment = moment;
app.use(router); // Подключение маршрутизации
app.use(store); 
app.mount('#app'); // Привязка экземпляра приложения к странице HTML (находится в public)