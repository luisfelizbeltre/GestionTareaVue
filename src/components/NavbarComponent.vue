<template>
  <nav>
    <div class="dashboard-title">DASBOARD Manager</div>
    <router-link to="/" aria-label="Ir a la página principal">Home</router-link>
    <router-link v-if="user" to="/dashboard" aria-label="Ver mis proyectos">Proyectos</router-link>
    <router-link v-if="user" to="/tasks" aria-label="Ver mis tareas">Tareas</router-link>
    <router-link v-if="user" to="/profile" aria-label="Ir a mi perfil">Perfil</router-link>
    <router-link v-if="user && isAdmin" to="/manage-users" aria-label="Gestionar usuarios">Gestionar usuarios</router-link>
    <router-link v-if="!user" to="/login" aria-label="Iniciar sesión">Login</router-link>
    <router-link v-if="!user" to="/registeradm" aria-label="Registrar un nuevo administrador">Register</router-link>
    <button v-if="user" @click="handleLogout" aria-label="Cerrar sesión">Logout</button>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuth } from '../store/useAuth'; // Ruta al composable

const router = useRouter();
const { user, logout, isAdmin } = useAuth(); 

const handleLogout = () => {
  logout();
  router.push('/login');
};
</script>

<style scoped>
nav {
  display: flex;
  flex-direction: row; /* Cambiado a fila para elementos uno al lado del otro */
  align-items: center; /* Alinear verticalmente al centro */
  gap: 1rem; /* Espaciado entre elementos */ 
  padding: 1rem;
  background-color: #185cdb; /* Color de fondo más oscuro */
  border-bottom: 1px solid #ddd;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Sombra para un efecto elevado */
  transition: background-color 0.3s ease; /* Transición para cambios de fondo */
}

nav:hover {
  background-color: #2c4b92; /* Cambio de color al pasar el mouse */
}

.dashboard-title {
  font-size: 24px; /* Ajusta el tamaño del título */
  color: #ffffff;  /* Color del título */
  font-weight: bold; /* Negrita para el título */
  margin-right: auto; /* Para empujar los enlaces a la derecha */
}

nav a {
  text-decoration: none;
  color: #ffffff; /* Color del texto */
  font-size: large;
  padding: 10px; /* Espacio dentro de los enlaces */
  border-radius: 5px; /* Bordes redondeados */
  transition: background-color 0.3s ease; /* Transición para el fondo */
}

nav a:hover {
  background-color: rgba(255, 255, 255, 0.2); /* Color de fondo al pasar el mouse */
}

nav button {
  background: none;
  border: none;
  color: #e8ebee; /* Color del texto del botón */
  cursor: pointer;
  font-size: large;
  padding: 10px; /* Espacio dentro del botón */
  border-radius: 5px; /* Bordes redondeados para el botón */
  transition: background-color 0.3s ease, color 0.3s ease; /* Transiciones para el fondo y color */
}

nav button:hover {
  background-color: rgba(255, 255, 255, 0.2); /* Color de fondo al pasar el mouse */
  color: #ffffff; /* Cambiar el color del texto al pasar el mouse */
}
</style>
