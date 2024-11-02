<template>
  <div class="container mt-5">
    <div class="card shadow-sm p-4">
      <h1 class="text-center">{{ title }}</h1>
      <form @submit.prevent="register">
        
        <!-- Organización -->
        <div v-if="showTenantName" class="mb-3">
          <label for="tenantName" class="form-label">Nombre de la Organización</label>
          <input v-model="tenantName" type="text" id="tenantName" class="form-control" required />
        </div>

        <!-- Nombre de usuario -->
        <div class="mb-3">
          <label for="username" class="form-label">{{ usernameLabel }}</label>
          <input v-model="username" type="text" id="username" class="form-control" required />
        </div>

        <!-- Correo Electrónico -->
        <div class="mb-3">
          <label for="email" class="form-label">Correo Electrónico</label>
          <input v-model="email" type="email" id="email" class="form-control" required />
        </div>

        <!-- Contraseña -->
        <div class="mb-3">
          <label for="password" class="form-label">Contraseña</label>
          <input v-model="password" type="password" id="password" class="form-control" required />
        </div>

        <!-- Selección de rol -->
        <div v-if="showRoleSelect" class="mb-3">
          <label for="role" class="form-label">Selecciona el Rol</label>
          <select v-model="role" id="role" class="form-select" required>
            <option value="user">Usuario</option>
            <option value="mod">Moderador</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <!-- Botón de Enviar -->
        <button type="submit" class="btn btn-primary w-100">{{ buttonText }}</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref,defineProps } from 'vue';
import AuthService from '../services/auth.service';
import { useRouter } from 'vue-router';


const props = defineProps({
  title: { type: String, default: 'Registro de Organización' },
  usernameLabel: { type: String, default: "Nombre del Administrador" },
  buttonText: { type: String, default: 'Registrar Organización' },
  showTenantName: { type: Boolean, default: true },
  showRoleSelect: { type: Boolean, default: false },
});

const tenantName = ref('');
const username = ref('');
const email = ref('');
const password = ref('');
const role = ref('');

const router = useRouter();

const register = async () => {
  try {
    const data = {
      tenantName: props.showTenantName ? tenantName.value : AuthService.getCurrentUser()?.tenantName || '',
      username: username.value,
      email: email.value,
      password: password.value,
      role: [props.showRoleSelect ? role.value : 'ADMIN']
    };
    
    const response = await (props.showTenantName ? AuthService.registerTenant(data) : AuthService.registerUser(data));

    if (response.data) {
      alert('Registro exitoso');
      router.push('/login');
    }
  } catch (error) {
    console.error('Error en el registro:', error);
    alert('Error en el registro');
  }
};
</script>

<style scoped>
.container {
  max-width: 500px;
}

.card {
  border-radius: 8px;
}

@media (max-width: 500px) {
  .container {
    padding: 10px;
  }
}
</style>
