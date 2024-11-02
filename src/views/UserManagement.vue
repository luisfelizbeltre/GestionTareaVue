<template>
  <div class="container mt-4">
    <div class="row">
      <!-- Sección de gestión de usuarios -->
      <div class="col-md-8 mb-4">
        <div class="card shadow-sm">
          <div class="card-header">
            <h3>Gestión de Usuarios y Roles</h3>
          </div>
          <div>
            <input type="text" v-model="searchQuery" class="form-control" placeholder="Buscar Usuarios" >
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item" v-for="user in filteredUser" :key="user.id">
              <div class="user-details">
                <p><strong>Username:</strong> {{ user.username }}</p>
                <p><strong>Email:</strong> {{ user.email }}</p>
                <p><strong>Roles:</strong></p>
                <ul class="list-unstyled">
                  <li v-for="(role, index) in user.roles" :key="index">
                    <span class="badge bg-primary me-1">{{ role }}</span>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Sección de agregar usuario -->
      <div class="col-md-4">
        <div class="card shadow-sm">
          <div class="card-header">
            <h3>Agregar Usuario</h3>
          </div>
          <div class="card-body">
            
            <RegisterTenant
              title="Agregar Usuario"
              username-label="Nombre de Usuario"
              button-text="Agregar Usuario"
              :show-role-select="true"
              :show-tenant-name="false"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref,computed } from 'vue';
import userService from '@/services/userService';
import RegisterTenant from '@/components/RegisterTenant.vue';

const users = ref([]);
const searchQuery= ref('')

const fetchUsers = async () => {
  try {
    const response = await userService.getAllUsers();
    users.value = response.data;
    console.log(users.value);
  } catch (error) {
    console.error('Error al cargar los usuarios:', error);
    alert('Error al cargar los usuarios');
  }
};



const filteredUser= computed(()=>{
const searchText = searchQuery.value.trim().toLowerCase();
console.log(searchText)
return users.value.filter(user=>{
  const userUsername=user.username ? user.username.toLowerCase() :''
  return userUsername.includes(searchText)
})


})


onMounted(fetchUsers);
</script>

<style scoped>
.user-details p {
  margin-bottom: 5px;
  color: #555;
}
</style>
