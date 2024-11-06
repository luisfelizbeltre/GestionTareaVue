<template>
  <div class="container mt-5 dashboard-container">
   
    <div class="projects-list col-md-5">
    <h3>Proyectos</h3>

      <div class="filter-container">
        <input v-model="searchQuery" type="text" class="form-control" placeholder="Buscar proyecto...">
     </div>

    <div v-for="project in filteredProjects" :key="project.id" class="card mb-3 p-3 shadow-sm">
      <div class="card-body">
        <h4 class="card-title">{{ project.name }}</h4>
        <p class="card-text">
          Fecha inicio: {{ formatDate(project.startDate) }} | Fecha fin: {{ formatDate(project.endDate) }}
        </p>
        <p class="card-text">Responsable: {{ project.responsibleUsername }}</p>
        <p class="card-text">Tareas ({{ project.tasks.length }})</p>
        <button @click="viewProject(project.id)" class="btn btn-outline-primary btn-sm">
          👁️ Ver detalle
        </button>
         <!-- Botón para eliminar el proyecto -->
      <button  @click="confirmDeleteProject(project.id)" class="btn float-end btn-succes">
      🗑️ Eliminar Proyecto
      </button>
      
    </div>
    <div class="progress mb-3">
              <div
                class="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                :style="{ width: progressPercentage(project) + '%' }"
                :aria-valuenow="progressPercentage(project)"
                aria-valuemin="0"
                aria-valuemax="100">
              </div>
      </div>
      <p>{{ completedTasks(project) }} de {{ project.tasks.length }} tareas completadas ({{ progressPercentage(project) }}%)</p>
    </div>
     

      
      <!-- Botón de crear proyecto para roles no admin -->
      <div v-if="!isAdmin" class="text-center mt-4">
        <button @click="toggleCreateProjectForm" class="btn btn-primary">
          ➕ Crear nuevo proyecto
        </button>
      </div>
    </div>

    <!-- Formulario de creación de proyecto -->
    <div class="create-project-container card mt-3 shadow" v-if="showCreateProjectForm">
      <div class="card-body">
        <button class="btn-close float-end" @click="toggleCreateProjectForm"></button>

        <CreateProject/>
   
      </div>
      
      
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs';
import { ref, onMounted,computed } from 'vue';
import projectService from '@/services/projectService';
import { useRouter } from 'vue-router';
import CreateProject from '../components/CreateProject.vue';
import authService from '@/services/auth.service';
import Swal from 'sweetalert2';

const isAdmin = ref(false);
const roles = authService.getCurrentUser().roles;

if (roles.includes("ROLE_USER") || roles.includes("ROLE_MODERATOR")) {
  isAdmin.value = true;
}
const searchQuery = ref('');

// Propiedad computada para filtrar proyectos en base al texto de búsqueda
const filteredProjects = computed(() => {
  const searchText = searchQuery.value.trim().toLowerCase();

  
  return projects.value.filter(project => {
    const projectName = project.name ? project.name.toLowerCase() : '';
    return projectName.includes(searchText);
  });
});

function completedTasks(project) {
  // Verifica que project y project.tasks estén definidos
  return project && project.tasks ? project.tasks.filter(task => task.status === "Completed").length : 0;
}

function progressPercentage(project) {
  // Verifica que project y project.tasks estén definidos
  const total = project && project.tasks ? project.tasks.length : 0;
  return total > 0 ? Math.round((completedTasks(project) / total) * 100) : 0;
}



const projects = ref([]);
const showCreateProjectForm = ref(false);
const router = useRouter();

const loadProjects = async () => {
  try {
    const response = await projectService.getAllProjects();
    projects.value = response.data;
    if (sessionStorage.getItem("auth") === "true") {
      location.reload();
      sessionStorage.removeItem("auth");
    }
  } catch (error) {
    console.error("Error al cargar proyectos:", error);
    Swal.fire("Error al cargar proyectos.", "error");

  }
};

onMounted(loadProjects);

const viewProject = (projectId) => {
  if (roles.includes('ROLE_USER')) {
    router.push(`/tasks?projectId=${projectId}`);
  } else {
    router.push(`/projects/${projectId}`);
  }
};

const formatDate = (date) => {



  return date ? dayjs(date).format('DD/MM/YYYY HH:mm') : "Fecha no disponible";
};

const toggleCreateProjectForm = () => {
  showCreateProjectForm.value = !showCreateProjectForm.value;
};

const confirmDeleteProject = (projectId) =>{
  Swal.fire({
    title: "¿Estás seguro de que quieres eliminar este proyecto?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  }).then((result) =>{
    if (result.isConfirmed) {
      deleteProject(projectId);
      
    }
  } );
};
// Función para eliminar el proyecto y redirigir al usuario
const deleteProject = async (projectId) => {
  try {
    await projectService.deleteProject(projectId);
   console.log(projectId)
    Swal.fire("¡Eliminado!", "El proyecto ha sido eliminado correctamente.", "success");
    loadProjects()
  } catch (error) {
    console.error("Error al eliminar el proyecto:", error);
    Swal.fire("Error", "Hubo un problema al eliminar el proyecto.", "error");
  }
};


</script>

<style scoped>
.dashboard-container {
  display: flex;
  gap: 20px;
}

.progress-container {
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 10px;
  margin: 10px 0;
  height: 20px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color:#185cdb;
  transition: width 0.3s ease;
}

.projects-list {
  max-height: 800px;
  overflow-y: auto;
}

.create-project-container {
  padding: 20px;
  width: 80%;
  margin-top: 100px;
}

@media (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
    align-items: center;
  }

  .projects-list, .create-project-container {
    width: 100%; 
  }

  .projects-list {
    max-height: 600px; 
  }
  .create-project-container {
    margin-top: 20px;
  }
}
</style>
