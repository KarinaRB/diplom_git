<template>
    <div id="content">
        <h4 class="mx-auto mt-4">Регистрация пользователя</h4>
        <form name="form" @submit="handleRegister">
            <div v-if="!successful">
                <div class="form-group">
                    <input type="text" class="form-control mt-2" name="name" placeholder="Логин" required v-model="user.name">
                </div>
                <div class="form-group">
                    <input type="password" class="form-control mt-2" name="password" placeholder="Пароль" required v-model="user.password"/>
                </div>
                <div class="form-group">
                    <button class="btn btn-outline-light mt-2">Зарегистрировать</button>
                </div>
            </div>
            <div class="form-group">
                <div v-if="successMessage" class="alert alert-success" role="alert">{{successMessage}}</div>
            </div>
            <div class="form-group">
                <div v-if="errorMessage" class="alert alert-danger" role="alert">{{errorMessage}}</div>
            </div>
        </form>
    </div>
</template>
<script>
    export default {
        name: 'RegisterUser',
        data() {
            return {
                user: {
                    name: "",
                    password: "",
                    role: 1
                },
                successful: false,
                successMessage: '',
                errorMessage: ''
            };
        },
        computed: {
            loggedIn() {
                return this.$store.state.auth.status.loggedIn;
            }
        },
        mounted() {
            if (this.loggedIn) {
                // Авторизация прошла успешно, переходим к главной странице.
                // Используем такую конструкцию, а не this.$router.push, так как требуется перезагрузить страницу для обновления локального хранилища
                window.location.href = '/';
            }
        },
        methods: {
            handleRegister(e) {
                this.user.role = 1;
                e.preventDefault();
                this.successMessage = '';
                this.errorMessage = '';
                this.$store.dispatch("auth/register", this.user) // обращаемся к методу register, который определён в auth.service.js
                    .then(data => {
                        this.successMessage = data.message;
                        this.successful = true;
                    })
                    .catch(e => {
                        this.errorMessage = e.response.data.message;
                    });
            }
        }
    };
</script>

<style>
</style>