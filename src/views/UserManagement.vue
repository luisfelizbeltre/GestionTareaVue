<template>
    <div class="user-management">
      <h3>Gestión de Usuarios y Roles</h3>

      <ul>
        <li v-for="user in users"  v-bind:key="user.id">
          <hr>
          Username: {{ user.username }} 
          <br>
          Email: {{ user.email }}
          <hr>
        </li>
      </ul>



      <input type="text" v-model="newUser" placeholder="Nuevo Usuario" />
      <select v-model="newUserRole">
        <option value="USER">Usuario</option>
        <option value="ADMIN">Administrador</option>
        <option value="MODERATOR">Moderador</option>
      </select>
      <button @click="addUser">Agregar Usuario</button>
    </div>
  </template>
  
<script setup>
import { onMounted, ref } from 'vue';
import userService from '@/services/userService';

// Definir los estados con `ref`
const newUser = ref('');
const newUserRole = ref('USER');
const users = ref([]);
// Método par
// Función para cargar la lista de usuarios
const fetchUsers = async () => {
  try {
    const response = await userService.getAllUsers();
    users.value = response.data;
    console.log(users.value)
  } catch (error) {
    console.error("Error al cargar los usuarios:", error);
    alert("Error al cargar los usuarios");
  }
};
onMounted(fetchUsers)

const addUser = () => {
  console.log(`Usuario agregado: ${newUser.value}, Rol: ${newUserRole.value}`);
};
</script>

  
  <style scoped>
  .user-management {
    padding: 10px;
  }
  </style>
  