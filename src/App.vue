<template>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet">

  <div id="app">
    <NavBar class="nav"/>
    <router-view></router-view>
  </div>
  
</template>

<script setup>




import NavBar from './components/NavbarComponent.vue'; 
</script>

<style>
* {
    font-family: 'Roboto', sans-serif;
}
.nav {
  position: sticky;
  top: 0;

}


</style>
