<template>
  <div class="user-management">
    <h3>Gestión de Usuarios y Roles</h3>

    <ul class="user-list">
      <li class="user-item" v-for="user in users" :key="user.id">
        <div class="user-details">
          <p><strong>Username:</strong> {{ user.username }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
<p>rol</p>
          <ul>
            <li v-for="(role,index) in user.roles" :key="index"  >
            {{ role }}
          </li>
         </ul>
         
        </div>
        <hr />
      </li>
    </ul>

    
  </div>
  <RegisterTenant
      class="user-form"
      title="Agregar Usuario"
      username-label="Nombre de Usuario"
      button-text="Agregar Usuario"
      :show-role-select="true"
      :show-tenant-name="false"
    />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import userService from '@/services/userService';
import RegisterTenant from '@/components/RegisterTenant.vue';

const users = ref([]);


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
onMounted(fetchUsers);
</script>

<style scoped>
.user-management {
  float: left;

  align-items: center;
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.user-management h3 {
  font-size: 1.8em;
  color: #333;
  margin-bottom: 25px;
}

.user-list {
  list-style: none;
  padding: 0;
  width: 100%;
}

.user-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 15px;
  background-color: #f3f3f3;
  border-radius: 8px;
  margin-bottom: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.user-item:hover {
  transform: translateY(-3px);
}

.user-details {
  font-size: 1em;
  line-height: 1.6;
  color: #555;
}

hr {
  width: 100%;
  border: 0;
  border-top: 1px solid #ddd;
  margin: 10px 0;
}




</style>
