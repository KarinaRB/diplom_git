<template>
    <div id="content">
        <h4>Грамматики</h4>
        <ul class="list-group">
            <li class="list-group-item" v-for="(rule, index) in rules" :key="index">
                <router-link class="item" :to="{
                        name: 'rule-details',
                        params: { id: rule.id }
                    }">
                    {{ index+1 }}) {{ rule.name }} {{ rule.id }}
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
    import http from "../../http-common";
    export default {
        name: "UserRules",
        data() {
            return {
                rules: []
            };
        },
        computed: { // вычисляемые свойства
            currentUser() {
                return this.$store.state.auth.user;
            }
        },
        methods: {
            getRules() {
                http
                    .get("/rulesForUser/userId=" + this.currentUser.id)
                    .then(response => {
                        this.rules = response.data;
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
        },
        mounted() {
            this.getRules();
        }
    }
</script>