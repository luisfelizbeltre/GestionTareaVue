<template>
    <div class="company-list">
      <div v-if="isLoading" class="loading">Cargando empresas...</div>
  
      <div v-else>
        <h1>Empresas</h1>
        
        <!-- Tabla de empresas -->
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuarios</th>
              <th>Proyectos</th>
              <th>Tareas</th>
              <th>Acciones</th>

            </tr>
          </thead>
          <tbody>
            <tr v-for="company in companies" :key="company.id">
              <td>{{ company.name }}</td>
              <td>{{ company.users.length }}</td>
              <td>{{ company.projects.length }}</td>
              <td>{{againstTasks(company.projects) }}</td>
              <td>
                <button @click="confirmDeleteCompany(company.id)" class="btn btn-danger">Eliminar</button>
              </td>
            </tr>
            
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import companyService from '@/services/companyService';
  import Swal from 'sweetalert2';
  
  const companies = ref([]);
  const isLoading = ref(true);
  
  // Función para cargar las empresas
  const loadCompanies = async () => {
    try {
      const response = await companyService.getAllCompanies();
      companies.value = response.data;
      console.log(response.data);
      
    } catch (error) {
      console.error("Error al cargar las empresas:", error);
      Swal.fire("Error", "No se pudieron cargar las empresas", "error");
    } finally {
      isLoading.value = false;
    }
  };
  
  const againstTasks = (projects) => {
  let contandor = 0;
  // Asegurarse de que projects sea un array
  if (Array.isArray(projects)) {
    projects.forEach(element => {
      // Verificamos si `tasks` está definido y es un array antes de intentar acceder a su longitud
      if (Array.isArray(element.tasks)) {
        contandor += element.tasks.length;
      }
    });
  }
  return contandor;
}



  // Confirmar eliminación de empresa
  const confirmDeleteCompany = (companyId) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la empresa permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCompany(companyId);
      }
    });
  };
  
  // Eliminar una empresa
  const deleteCompany = async (companyId) => {
    try {
      await companyService.deleteCompany(companyId);
      Swal.fire("Éxito", "Empresa eliminada correctamente", "success");
      loadCompanies(); // Recargar la lista de empresas
    } catch (error) {
        console.log(error)
      Swal.fire("Error", "No se pudo eliminar la empresa", "error");
    }
  };
  
  // Cargar empresas al montar el componente
  onMounted(() => {
    loadCompanies();
  });
  </script>
  
  <style scoped>
  .company-list {
    padding: 20px;
  }
  
  .table {
    width: 100%;
    margin-top: 20px;
  }
  
  .table th, .table td {
    padding: 10px;
    text-align: left;
  }
  
  .loading {
    text-align: center;
    font-size: 18px;
    color: gray;
  }
  </style>
  