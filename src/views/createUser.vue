<template>
  <div class="contenedor-crear-usuario">
    <h2>Crear Usuario</h2>
    <form @submit.prevent="crearUsuario">
      <div class="grupo-formulario">
        <label for="username">Nombre de usuario:</label>
        <input v-model="usuario.username" id="username" placeholder="Introduce el nombre de usuario" required />
      </div>

      <div class="grupo-formulario">
        <label for="email">Correo electrónico:</label>
        <input v-model="usuario.email" id="email" type="email" placeholder="Introduce el correo electrónico" required />
      </div>

      <div class="grupo-formulario">
        <label for="password">Contraseña:</label>
        <input v-model="usuario.password" id="password" type="password" placeholder="Introduce la contraseña" required />
      </div>

      <div class="grupo-formulario">
        <label for="role">Rol:</label>
        <select v-model="usuario.role" id="role" required>
          <option value="ROLE_ADMIN">Administrador</option>
          <option value="ROLE_MANAGER">Gerente</option>
          <option value="ROLE_USER">Usuario</option>
        </select>
      </div>

      <button type="submit" class="btn btn-primary">Crear Usuario</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import UserService from '../services/userService';

// Variable reactiva para almacenar los datos del usuario
const usuario = ref({
  username: '',
  email: '',
  password: '',
  role: 'ROLE_USER',
});

// Función para crear un usuario
const crearUsuario = async () => {
  try {
    await UserService.createUser(usuario.value);
    alert("Usuario creado con éxito");
  } catch (error) {
    console.error(error);
    alert("Error al crear el usuario");
  }
};
</script>

<style scoped>
.contenedor-crear-usuario {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
}

.grupo-formulario {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn:hover {
  background-color: #0056b3;
}
</style>
