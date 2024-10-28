<template>
  <div class="dashboard-container">
    <!-- Lista de proyectos -->
    <div class="projects-list">
      <h3>Proyectos</h3>
      
      <div v-for="(project, index) in projects" :key="index" class="project-item">
        <h4>{{ project.name }}</h4>
      <!--  <p>Inicio: {{ project.startDate }}</p>
        <p>Fin: {{ project.endDate }}</p>-->
        <p>Fecha inicio: {{ formatDate(project.startDate) }} | Fecha fin:  {{ formatDate( project.endDate )}}</p>
        <p>Responsable: {{ project.responsibleUsername }}</p>
        <p>Tareas -> ({{ project.tasks.length }})</p>
        <button @click="viewProject(project.id)">👁️ Ver detalle</button>
      </div>
      <div v-if="!isAdmin">
        <button   @click="toggleCreateProjectForm" class="create-project-button">
        ➕ Crear nuevo proyecto
      </button>
      </div  >
     
      
    </div>

    <!-- Formulario de creación de proyecto -->
    <div class="create-project-container" v-if="showCreateProjectForm">
      <CreateProject />
    </div>
  </div>
 
</template>

<script setup>
import dayjs from 'dayjs';

import { ref, onMounted } from 'vue';
import projectService from '@/services/projectService';
import { useRouter } from 'vue-router';
import CreateProject from '../components/CreateProject.vue';
import authService from '@/services/auth.service';
//import { useAuth } from '@/store/useAuth';
const rol = authService.getCurrentUser().roles;
const  isAdmin= ref(false)
if(rol.includes("ROLE_USER")){
  isAdmin.value=true;
}
const projects = ref([]);
const showCreateProjectForm = ref(false);  // Controla si se muestra o no el formulario
const router = useRouter();

// Cargar proyectos al montar el componente
const loadProjects = async () => {
  try {
    const response = await projectService.getAllProjects();
    projects.value = response.data;
    console.log("goool"+response.data);
    console.log("goool " + JSON.stringify(response.data, null, 2)); // Con `null` y `2` para obtener un formato bonito
    console.log( "ddddd"+projects.value)

    
    if(sessionStorage.getItem("auth")==="true"){
      location.reload();
      sessionStorage.removeItem("auth")
    }
  } catch (error) {
    console.error("Error al cargar proyectos:", error);
    alert("Error al cargar proyectos");
  }
};

onMounted(loadProjects);

// Ver detalles del proyecto seleccionado
const viewProject = (projectId) => {
   
  const rol = authService.getCurrentUser().roles;
  console.log(rol)
  if (rol.includes('ROLE_USER')) {
    router.push(`/tasks`);
    return;
  }
  
  
  
  
  router.push(`/projects/${projectId}`); // Redirigir a la ruta de detalles del proyecto
};

function formatDate(date) {
  if (!date) 
  {
  return "fecha no disponible"  
  }
  
      return dayjs(date).format('DD/MM/YYYY HH:mm'); 
    }
// Mostrar/ocultar formulario de crear proyecto
const toggleCreateProjectForm = () => {
  showCreateProjectForm.value = !showCreateProjectForm.value; 
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  padding: 20px;
}

.projects-list {
  width: 40%; /* Cambiar el ancho para dejar espacio para el formulario */
  padding: 10px;
  border-right: 1px solid #ccc;
  max-height: 800px;
  overflow-y: auto;
}

.project-item {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}

.create-project-button {
  background-color: #007bff;
  color: white;
  padding: 8px 10px;
  border: none;
  cursor: pointer;
}

.create-project-button:hover {
  background-color: #0056b3;
}

.create-project-container {
  width: 60%; /* El formulario ocupará el espacio restante al lado de la lista de proyectos */
  padding: 10px;
 
}
</style>
