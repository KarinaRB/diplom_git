<template>
    <div id="content">
        <div v-if="this.rule">
            <h4>Грамматика</h4>
            <form @submit="updateRule">
                <input type="text" name="name" placeholder="Название" required v-model="rule.name" class="form-control mt-2">
                <textarea name="grammar" placeholder="Правила" required v-model="rule.grammar" class="form-control mt-2"></textarea>
                <input type="text" name="startSymbol" placeholder="Начальный символ" required v-model="rule.startSymbol" class="form-control mt-2">
                <input type="text" name="endSymbol" placeholder="Символ выхода" required v-model="rule.endSymbol" class="form-control mt-2">
                <input type="submit" value="Обновить" class="btn btn-outline-light w-25 mt-2">
            </form>
            <button v-on:click="deleteRule()" class="btn btn-outline-light">Удалить</button>
            <button class="btn btn-outline-light">
                <router-link class="nav-link" :to="{
                        name: 'draw-tree',
                        params: { id: rule.id }
                    }"> 
                    Отрисовка дерева
                </router-link>
            </button>
        </div>
        <div v-else>
            <h4>Такой грамматики не найдено</h4>
        </div>
    </div>
</template>

<script>
    import http from "../../http-common";
    export default {
        name: "RuleDetails",
        props: ['id'], // входные параметры
        data() {
            return {
                rule: null
            };
        },
        computed: {
            currentUser(){
                return this.$store.state.auth.user;
            }
        },
        methods: {
            getRule() {
                http
                    .get("/rule/" + this.id) // обращаемся к серверу для получения списка пользователей, id взят из входных параметров (props)
                    .then(response => { // запрос выполнен успешно
                        console.log(response);
                        this.rule = response.data;
                    })
                    .catch(e => { // запрос выполнен с ошибкой
                        console.log(e);
                    });
            },
            updateRule(e) {
                e.preventDefault(); // запрет отправки формы, так как обрабатывать будем с помощью методов axios
                var data = {
                    name : this.rule.name,
                    grammar : this.rule.grammar,
                    startSymbol : this.rule.startSymbol,
                    endSymbol : this.rule.endSymbol,
                    user_id: this.currentUser.id
                };

                http
                    .post("/updateRule/" + this.rule.id, data)
                    .then(() => {
                        this.$router.push('/userRules'); 
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
            deleteRule() {
                http
                    .post("/deleteRule/" + this.rule.id)
                    .then(() => {
                        // переходим к списку (переход по ссылкам программно)
                        this.$router.push('/userRules');
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
        },
        mounted() { // загружаем данные пользователя
            this.getRule();
        }
    }
</script>