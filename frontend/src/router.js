import { createWebHistory, createRouter } from "vue-router";
// импорт компонентов
import ListUsers from "./components/user/ListUsers";
import AddUser from "./components/user/AddUser";
import User from "./components/user/User";

import Login from "./components/authorization/Login";
import Profile from "./components/authorization/Profile";
import Register from "./components/authorization/Register";

import store from "./store/index";

import AddRule from "./components/rule/AddRule";
import UserRules from "./components/rule/UserRules";
import Rule from "./components/rule/Rule"
import DrawTree from "./components/rule/DrawTree"

// определяем маршруты
const routes = [
    {
        path: "/listUsers", // указание маршрута, по которому будем переходить к списку пользователей
        name: "users", // имя маршрута
        alias: "/users", // указание дополнительного маршрута
        component: ListUsers, // компонент, на основании которого будет отрисовываться страница
        meta: {
            title: "Список пользователей"
        }
    },
    {
        path: "/user/:id",
        name: "user-details",
        component: User,
        props: true, // указываем, что компонент User.vue может принимать параметры в адресной строке, например, в path указан id
        meta: {
            title: "Данные пользователя"
        }
    },
    {
        path: "/addUser",
        name: "add-user",
        component: AddUser,
        meta: {
            title: "Добавление пользователя"
        }
    },
    {
        path: "/login",
        name: "login-user",
        component: Login,
        meta: {
            title: "Вход в систему"
        }
    },
    {
        path: "/register",
        name: "register-user",
        component: Register,
        meta: {
            title: "Регистрация"
        }
    },
    {
        path: "/profile",
        name: "profile-user",
        component: Profile,
        meta: {
            title: "Профиль пользователя",
            // маршрут защищаем (делаем доступным только авторизованным пользователям)
            requiredAuth: true
        }
    },
    {
        path: "/addRule",
        name: "add-rule",
        component : AddRule,
        meta:{
            title : "Добавление грамматики",
            requiredAuth : true
        }
    },
    {
        path: "/userRules",
        name : "user-rules",
        component: UserRules,
        meta:{
            title : "Грамматики пользователя",
            requiredAuth : true
        }
    },
    {
        path: "/rule/:id",
        name: "rule-details",
        component: Rule,
        props: true,
        meta:{
            title : "Грамматика",
            requiredAuth : true
        } 
    },
    {
        path: "/drawTree/:id",
        name: "draw-tree",
        component: DrawTree,
        props: true,
        meta:{
            title: "Отрисовка",
            requiredAuth : true
        }
    }
];

const router = createRouter({
    history: createWebHistory(), // указываем, что будет создаваться история посещений веб-страниц
    routes // подключаем маршрутизацию
});

export default router;

// указание заголовка компонентам (тега title), заголовки определены в meta
router.beforeEach(async (to, from, next) => {
    // для тех маршрутов, для которых не определены компоненты, подключается только App.vue
    // поэтому устанавливаем заголовком по умолчанию название "Главная страница"
    document.title = to.meta.title || 'Главная страница';

    // проверяем наличие токена и срок его действия
    const auth = await store.getters["auth/isTokenActive"];
    if (auth) {
        return next();
    }
    // если токена нет или его срок действия истёк, а страница доступна только авторизованному пользователю,
    // то переходим на страницу входа в систему (ссылка на /login)
    else if (!auth && to.meta.requiredAuth) {
        const user = JSON.parse(localStorage.getItem("user"));
        await store.dispatch("auth/refreshToken", user)
            .then(() => {
                return next();
            })
            .catch(() => {
                return next({path: "/login"});
            });
        return next({ path: "/login" });
    }
    return next();
});