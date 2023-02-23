<template>
    <div id="content">
        <h4>Добавление новой грамматики</h4>
        <div v-if="!submitted">
            <form @submit="addRule">
                <input type="text" name="name" placeholder="Название" required v-model.trim="rule.name" class="form-control mt-2">
                <textarea name="grammar" placeholder="Правила" required v-model="rule.grammar" class="form-control mt-2"></textarea>
                <input type="text" name="startSymbol" placeholder="Начальный символ" required v-model.trim="rule.startSymbol" class="form-control mt-2">
                <input type="text" name="endSymbol" placeholder="Символ выхода" required v-model.trim="rule.endSymbol" class="form-control mt-2">
                <input type="submit" value="Добавить" class="btn btn-outline-light w-25 mt-2">
            </form>
        </div>
        <div v-else>
            <h5>{{message}}</h5>
        </div>
    </div>
</template>

<script>
    import http from "../../http-common";
    //import { validationMixin } from 'vuelidate'

    export default{
        name: "AddRule",
        //mixins: [validationMixin],
        data(){
            return{
                rule: {
                    user_id : "",
                    name : "",
                    grammar : "",
                    startSymbol : "",
                    endSymbol : ""
                },
                message : "",
                submitted : false
            };
        },
        computed: {
            currentUser(){
                return this.$store.state.auth.user;
            }
        },
        methods:{
            addRule(e){
                e.preventDefault(); // запрет отправки формы, так как обрабатывать будем с помощью методов axios
                var data = {
                    name : this.rule.name,
                    grammar : this.rule.grammar,
                    startSymbol : this.rule.startSymbol,
                    endSymbol : this.rule.endSymbol,
                    user_id: this.currentUser.id
                };
                http
                    .post("/addRule", data)
                    .then(() => { // запрос выполнился успешно
                        this.message = "Грамматика добавлена"
                    })
                    .catch(e => { // при выполнении запроса возникли ошибки
                        console.log(e);
                        this.message = "Грамматика не добавлена, повторите попытку или обратитесь к администратору для выяснения причины ошибки";
                    });
                this.submitted = true;
            }
        }
    }
</script>