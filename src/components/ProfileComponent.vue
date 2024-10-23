<template>
  <div class="contenedor-perfil">
    <h1 class="titulo-perfil">Perfil</h1>
    <div v-if="usuario" class="info-perfil">
      <h1> <strong>Organización:</strong> {{ usuario.tenantName }}</h1>
      <p><strong>Nombre de usuario:</strong> {{ usuario.username }}</p>
      <p><strong>Correo electrónico:</strong> {{ usuario.email }}</p>
      
      <!-- Mostrar texto basado en el rol del usuario -->
      <p v-if="esAdmin" class="texto-admin"><strong>¡Eres administrador!</strong></p>
      <p v-if="esAdmin" class="enlace-admin">
        <a href="http://localhost:8081/create-project">Crear un nuevo proyecto</a>
      </p>
      <p v-if="esAdmin" class="enlace-admin">
        <a href="http://localhost:8081/createTask">Crear Tareas</a>
      </p>

      <router-link v-else to="/tasks" class="enlace-ver-tareas">Ver Mis Tareas</router-link>
    </div>
    <div v-else class="sin-info-usuario">
      <p>No hay información del usuario disponible. Por favor, inicia sesión.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AuthService from '../services/auth.service';

const usuario = ref(null);
const esAdmin = ref(false);

onMounted(() => {
  usuario.value = AuthService.getCurrentUser();
  
  // Verificar si el usuario tiene el rol de 'admin'
  if (usuario.value && usuario.value.roles && (usuario.value.roles.includes("ROLE_ADMIN") || usuario.value.roles.includes("ROLE_MANAGER"))) {
    esAdmin.value = true;
  }
});
</script>

<style scoped>
.contenedor-perfil {
  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.titulo-perfil {
  font-size: 28px;
  color: #333;
  margin-bottom: 20px;
}

.info-perfil {
  font-size: 18px;
  color: #555;
}

.info-perfil p {
  margin: 10px 0;
}

.texto-admin {
  font-size: 20px;
  color: #007BFF;
  font-weight: bold;
  margin-top: 20px;
}

.enlace-admin a {
  display: inline-block;
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #007BFF;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.enlace-admin a:hover {
  background-color: #0056b3;
}

.enlace-ver-tareas {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.enlace-ver-tareas:hover {
  background-color: #218838;
}

.sin-info-usuario {
  font-size: 16px;
  color: #888;
}
</style>
