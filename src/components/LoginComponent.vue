<template>
  <div class="contenedor-login">
    <h1 class="titulo-login">Iniciar Sesión</h1>
    <form @submit.prevent="handleLogin" class="formulario-login">
      <div class="grupo-formulario">
        <label for="username">Nombre de usuario</label>
        <input type="text" id="username" v-model="username" required class="input-formulario" :disabled="isLoading"/>
      </div>
      <div class="grupo-formulario">
        <label for="password">Contraseña</label>
        <input type="password" id="password" v-model="password" required class="input-formulario" :disabled="isLoading"/>
      </div>
      <button type="submit" class="boton-login">Iniciar Sesión</button>
      <span v-if="errorl" class="mensaje-error">{{ errorl }}</span>
      <div v-if="isLoading" class="cargando-spinner">
        <img src="/cargando.gif" alt="Cargando" srcset="">
      </div>
    </form>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '../services/auth.service';

// Variables reactivas para almacenar el estado del login
const errorl = ref('');
const username = ref('');
const password = ref('');
const router = useRouter();
const isLoading = ref(false);

// Función para manejar el inicio de sesión
const handleLogin = () => {
  isLoading.value = true;
  errorl.value = ""; // Limpiar errores previos
  AuthService.login({ username: username.value, password: password.value })
    .then(() => {
      sessionStorage.setItem("auth", "true")
      router.push('/dashboard'); // Redirigir al panel de control tras el login
    })
    .catch(error => {
      errorl.value = error.message; // Mostrar error si el login falla
      console.error('Error al iniciar sesión:', error.message);
    }).finally(() => {
      isLoading.value = false; // Detener el estado de carga
    });
};
</script>
<style scoped>
.contenedor-login {
  max-width: 400px;
  margin: 50px auto; /* Centrado y margen desde la parte superior */
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff; /* Fondo blanco para el formulario */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Sombra sutil */
}

.titulo-login {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #333;
}

.formulario-login {
  display: flex;
  flex-direction: column;
}

.grupo-formulario {
  margin-bottom: 15px;
}

.grupo-formulario label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.input-formulario {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.input-formulario:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.boton-login {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.boton-login:hover {
  background-color: #0056b3;
}

.boton-login:active {
  background-color: #004494;
}

.mensaje-error {
  color: red;
  font-weight: bold;
  margin-top: 10px;
}

.cargando-spinner img {
  width: 50px; /* Ajusta el tamaño del GIF si es necesario */
  height: 50px;
}
</style>
