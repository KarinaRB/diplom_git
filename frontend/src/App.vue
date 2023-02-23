<template>
  <div id="app">
    <navbar/>
    <router-view />
  </div>
</template>

<script>
    import Navbar from './components/Navbar'

    export default {
        name: 'App',
        components: {
            Navbar: Navbar
        }
    }
</script>

<!--определение стилей-->
<style>
  #app {
    font-family: ‘Raleway’,sans-serif; 
    font-size: 18px; 
    font-weight: 500; 
    line-height: 32px; 
    width: 100%;
  }
  html body{
    background-color: #6B717E;
    color: white;
    width: 100%;
  }
</style>