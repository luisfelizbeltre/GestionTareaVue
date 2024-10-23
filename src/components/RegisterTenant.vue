<template>
  <div class="registration-form">
    <h1>Registro de Organización</h1>
    <form @submit.prevent="register">
      <!--  nombre de la organización -->
      <div class="form-group">
        <label for="tenantName">Nombre de la Organización</label>
        <input v-model="tenantName" type="text" id="tenantName" required />
      </div>

      <!--  nombre de usuario del administrador -->
      <div class="form-group">
        <label for="username">Nombre de Usuario del Administrador</label>
        <input v-model="username" type="text" id="username" required />
      </div>

      <!-- correo electrónico del administrador -->
      <div class="form-group">
        <label for="email">Correo Electrónico del Administrador</label>
        <input v-model="email" type="email" id="email" required />
      </div>

      <!-- contraseña -->
      <div class="form-group">
        <label for="password">Contraseña</label>
        <input v-model="password" type="password" id="password" required />
      </div>

      <button type="submit" class="submit-button">Registrar Organización</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
// import axios from 'axios';
import AuthService from '../services/auth.service';
import { useRouter } from 'vue-router';

const tenantName = ref('');
const username = ref('');
const email = ref('');
const password = ref('');

const router = useRouter();
const register = async () => {
  try {
    const response = await AuthService.registerTenant({
      tenantName: tenantName.value,
      username: username.value,
      email: email.value,
      password: password.value,
      role: ['admin'], // Establecer el rol del usuario como administrador
    });

    if (response.data) {
      alert('Registro exitoso');
      router.push('/login');
      console.log('Registro exitoso');
    }
  } catch (error) {
    // Manejar errores de la solicitud, como mostrar mensajes de error
    console.error('Error en el registro:', error);
  }
};
</script>

<style scoped>
.registration-form {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f7f7f7;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #555;
}

input[type='text'],
input[type='email'],
input[type='password'] {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.3s ease;
}

input[type='text']:focus,
input[type='email']:focus,
input[type='password']:focus {
  border-color: #4CAF50;
}

.submit-button {
  width: 100%;
  padding: 10px;
  background-color: #4085c1;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #45a049;
}

.submit-button:active {
  background-color: #3e8e41;
}

.submit-button:focus {
  outline: none;
}

@media (max-width: 500px) {
  .registration-form {
    padding: 15px;
  }

  input[type='text'],
  input[type='email'],
  input[type='password'],
  .submit-button {
    font-size: 14px;
  }
}
</style>
