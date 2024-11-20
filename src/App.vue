<template>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet">

  <div id="app" class="layout">
    <NavBar />
    <main class="content">
      <router-view></router-view>
    </main>
    <FooterPie />
  </div>
</template>

<script setup>
import NavBar from './components/NavbarComponent.vue'; 
import FooterPie from './components/FooterPie.vue';
</script>

<style>
/* Aseguramos que todo ocupe el espacio necesario */
html, body {
  height: 100%; /* Altura de la ventana */
  margin: 0; /* Elimina márgenes */
}

#app {
  display: flex;
  flex-direction: column; /* Layout en columna */
  min-height: 100vh; /* Ocupa al menos la altura de la ventana */
}

.content {
  flex: 1; /* Permite que el contenido crezca y tome el espacio disponible */
}

footer {
  background-color: azure;
  color: rgb(0, 0, 0);
  padding: 2rem 0;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  width: 100%;
}
</style>
