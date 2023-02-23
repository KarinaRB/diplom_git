<template>
    <div id="content">
        <div v-if="this.user">
            <h4>Пользователь</h4>
            <form @submit="updateUser">
                <input type="text" name="name" placeholder="Имя" required v-model="user.name" class="form-control mt-2">
                <select v-model="user.role" class="form-select mt-2">
                    <option> Пользователь </option>
                    <option> Администратор </option>
                </select>

                <input type="submit" value="Обновить" class="btn btn-outline-light w-25 mt-2">
            </form>
            <button v-on:click="deleteUser()" class="btn btn-outline-light">Удалить</button>
        </div>
        <div v-else>
            <p>Выберите пользователя</p>
        </div> 
    </div>
    
</template>

<script>
    import http from "../../http-common";
    export default {
        name: "UserDetails",
        props: ['id'], // входные параметры
        data() {
            return {
                user: null
            };
        },
        methods: {
            getUser() {
                http
                    .get("/user/" + this.id) // обращаемся к серверу для получения списка пользователей, id взят из входных параметров (props)
                    .then(response => { // запрос выполнен успешно
                        this.user = response.data;
                    })
                    .catch(e => { // запрос выполнен с ошибкой
                        console.log(e);
                    });
            },
            updateUser(e) {
                e.preventDefault(); // запрет отправки формы, так как обрабатывать будем с помощью методов axios
                var data = {
                    name: this.user.name,
                    role: this.user.role
                };

                http
                    .post("/updateUser/" + this.user.id, data)
                    .then(() => {
                        this.$router.push('/listUsers'); // переходим к списку пользователей
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
            deleteUser() {
                http
                    .post("/deleteUser/" + this.user.id)
                    .then(() => {
                        // переходим к списку пользователей (переход по ссылкам программно)
                        this.$router.push('/listUsers');
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
        },
        mounted() { // загружаем данные пользователя
            this.getUser();
        }
    }
</script>

<style>
    #content{
        margin: 3%;
        font-family: ‘Raleway’,sans-serif; 
        font-size: 18px; 
        font-weight: 500; 
        line-height: 32px; 
    }
</style>