<template>
  <div class="project-list">
    <h3>Proyectos</h3>
    <ul v-if="projects.length > 0">
      <li v-for="project in projects" :key="project.id" class="project-item">
        <h4>{{ project.name }}</h4>
        <p>Fecha inicio: {{ formatDate(project.fechaInicio) }} | Fecha fin: {{ formatDate(project.fechaFin) }}</p>
        <p>Responsable: {{ project.responsable }}</p>
        <button @click="viewProject(project.id)">👁️ Ver detalles</button>
      </li>
    </ul>
    <p v-else>No hay proyectos disponibles.</p>
    <button @click="createProject">➕ Crear nuevo proyecto</button>
    


  </div>
  
</template>

<script setup>

import { ref, onMounted } from 'vue';
import dayjs from 'dayjs';

import { useRouter } from 'vue-router';
import projectService from '@/services/projectService';

const projects = ref([]);
const router = useRouter();
const isLoading = ref(false);

const loadProjects = async () => {
  isLoading.value = true;
  try {
   const response = await projectService.getAllProjects();
    projects.value = response.data
    
  } catch (error) {
    console.error("Error al cargar proyectos:", error);
    alert("Error al cargar proyectos");
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadProjects);

const viewProject = (projectId) => {

 

  router.push(`/projects/${projectId}`);
};

const createProject = () => {
  router.push('/create-project');
};
function formatDate(date) {
  console.log("mdsmakdkjsnadksaaaaaaaaa"+date)
      return dayjs(date).format('DD/MM');
    }

</script>

<style scoped>
.project-list {
  padding: 20px;
  border-right: 1px solid #ccc;
}

.project-item {
  margin-bottom: 20px;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

h4 {
  margin: 5px 0;
}

button {
  margin-top: 10px;
  background-color: #007BFF;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}


</style>
