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
      </div>
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
    alert("Error al cargar proyectos");
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
</script>

<style scoped>
.dashboard-container {
  display: flex;
  gap: 20px;
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
