<template>
  <div class="container mt-4">
    <div class="row">
      <!-- Sección de gestión de usuarios -->
      <div class="col-md-8 mb-4">
        <div class="card shadow-sm">
          <div class="card-header">
            <button class="float-end" @click="toggleUserForm">➕ Añadir Usuario</button>
            <h3>Gestión de Usuarios y Roles</h3>  
          </div>
          <div>
            <input type="text" v-model="searchQuery" class="form-control" placeholder="Buscar Usuarios" >
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item" v-for="user in filteredUser" :key="user.id">
              <div class="user-details"> 
                <button class="float-end" @click="confirmDeletedUser(user.id)" >Borrar usuario</button>
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
    

      <div>
    

    <!-- Modal -->
    <ModalComponent v-if="isAdduserFormVisible" @close="toggleUserForm">
      <!-- Header del modal -->
      <template #header>
        <h3>Agregar Usuario</h3>
      </template>

      <!-- Contenido del modal -->
      <RegisterTenant
        title="Agregar Usuario"
        username-label="Nombre de Usuario"
        button-text="Agregar Usuario"
        :show-role-select="true"
        :show-tenant-name="false"
      />
    </ModalComponent>
  </div>
    </div>
    </div>
  
</template>

<script setup>
import { onMounted, ref,computed } from 'vue';
import userService from '@/services/userService';
import RegisterTenant from '@/components/RegisterTenant.vue';
import Swal from 'sweetalert2';
import ModalComponent from './ModalComponent.vue';

const users = ref([]);
const searchQuery= ref('')
const isAdduserFormVisible = ref(false);
const fetchUsers = async () => {
  try {
    const response = await userService.getAllUsers();
    users.value = response.data;
    console.log(users.value);
  } catch (error) {
    console.error('Error al cargar los usuarios:', error);
    
    Swal.fire("Error al cargar los usuarios", "error");
  }
};



const toggleUserForm = () => {
   
  isAdduserFormVisible.value = !isAdduserFormVisible.value;
  };
const filteredUser= computed(()=>{
const searchText = searchQuery.value.trim().toLowerCase();
console.log(searchText)
return users.value.filter(user=>{
  const userUsername=user.username ? user.username.toLowerCase() :''
  return userUsername.includes(searchText)
})


})


const confirmDeletedUser = (userId) =>{
  Swal.fire({
    title: "¿Estás seguro de que quieres eliminar este usuario?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  }).then((result) =>{
    if (result.isConfirmed) {
     console.log(userId);
     deleteUsers(userId)
      
    }
  } );
};



const deleteUsers = async (userId) => {
  try {
    await userService.deleteUser(userId);
   console.log(userId)

    Swal.fire("¡Eliminado!", "El Usuario ha sido eliminado correctamente.", "success");
    await fetchUsers();
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    Swal.fire("Error", "Hubo un problema al eliminar el usuario.", "error");
  }
};


onMounted(fetchUsers);
</script>

<style scoped>
.user-details p {
  margin-bottom: 5px;
  color: #555;
}
</style>
