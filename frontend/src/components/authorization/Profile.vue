<template>
    <div id="content">
        <header>
            <h3>
                Профиль <strong>{{currentUser.name}}</strong>
            </h3>
        </header>

        <div>
            <strong>Id:</strong>
            {{currentUser.id}}
        </div>
        <div>
            <strong>Логин:</strong>
            {{currentUser.name}}
        </div>
        <div>
            <strong>Роль:</strong>
            {{currentUser.role}}
        </div>
    </div>
</template>
<script>
    export default {
        name: 'ProfileUser',
        computed: {
            currentUser() {
                return this.$store.state.auth.user;
            }
        },
        mounted() {
            if (!this.currentUser) {
                this.$router.push('/login');
            }
        }
    };
</script>

<style>
    #content{
        margin: 3%;
        font-family: ‘Raleway’,sans-serif; 
        font-size: 18px; 
        font-weight: 500; 
        line-height: 32px; 
    }
    #content form{
        padding: 3%;
        width: 50%;
        text-align: center;
    }
</style>