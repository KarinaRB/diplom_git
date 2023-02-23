<template>
    <div >
      <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">

          <router-link class="navbar-brand" to="#">
            <img src="../../img/волк.png" alt="" width="30" height="24" class="d-inline-block align-text-top">
          </router-link>

          <div class="collapse navbar-collapse" id="navbarNav">

            <ul class="navbar-nav">
              <li class="nav-item" v-if="currentUser && currentUser.role === 'Администратор'">
                <router-link class="nav-link" to="/listUsers">Пользователи</router-link>
              </li>
              <li class="nav-item" v-if="currentUser">
                <router-link class="nav-link" to="/addRule">Добавить грамматику</router-link>
              </li>
              <li class="nav-item" v-if="currentUser">
                <router-link class="nav-link" to="/userRules">Мои грамматики</router-link>
              </li>
              <li v-if="currentUser">
                <router-link class="nav-link position-absolute top-0 end-0" to="/profile">{{ currentUser.name }}</router-link>
                <a href @click.prevent="logOut" class="nav-link">Выйти</a>
              </li>
              <li v-else>
                <router-link class="nav-link" to="/login">Войти</router-link>
              </li>
            </ul>

          </div>
        </div>
      </nav>
    </div>
  </template>
  
  <script>
    export default {
        name: "NavBar",
        data() {
            return {};
        },
        computed: { // вычисляемые свойства
            currentUser() {
                return this.$store.state.auth.user;
            }
        },
        methods: {
            logOut() {
                this.$store.dispatch('auth/logout'); // обращаемся к методу logout, который определён в auth.service.js
                window.location.href = '/login'; // // Используем такую конструкцию, а не this.$router.push, так как требуется перезагрузить страницу для обновления локального хранилища
            }
        }
    };
  </script>
  
  <style>
    nav{
      background-color: #DFE0E2;
      font-family: ‘Raleway’,sans-serif; 
      font-size: 24px; 
      font-weight: 800; 
      width: 100%;
      height: auto;
    }
    li a.nav-link{
      color: #394053;
    }
    form{
      width: 60%;
    }
  </style>