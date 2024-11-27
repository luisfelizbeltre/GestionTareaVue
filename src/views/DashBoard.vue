<template>
  <div class="container mt-5 dashboard-container">
    <div class="projects-list col-md-7">
      <h3>Proyectos</h3>
      <div class="filter-container">
        <input v-model="searchQuery" type="text" class="form-control" placeholder="Buscar proyecto...">
      </div>

      <div v-for="project in filteredProjects" :key="project.id" class="card mb-3 p-3 shadow-sm">
        
        <div class="card-body ">
          <h4 class="card-title">{{ project.name }} <button  v-if="isAdmin" @click="openEditModal(project)"
            class="btn float-end btn-link btn-sm text-decoration-none" title="Editar Proyecto">
            ✏️
          </button></h4>

          
          <p class="card-text">
            Fecha inicio: {{ formatDate(project.startDate) }} | Fecha fin: {{ formatDate(project.endDate)  }}
          </p>
          <p class="card-text">Responsable: {{ project.responsibleUsername }}</p>
          <p class="card-text">Tareas ({{ project.tasks.length }})</p>
          <button @click="viewProject(project.id)" class="btn btn-outline-primary btn-sm">
            👁️ Ver detalle
          </button>
          <button v-if="isAdmin || isSuper" @click="confirmDeleteProject(project.id)"
            class="btn btn-outline-danger btn-sm float-end">
            🗑️ Eliminar Proyecto
          </button>
        </div>
        
        <div class="progress mb-3">
          <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
            :style="{ width: progressPercentage(project) + '%' }" :aria-valuenow="progressPercentage(project)"
            aria-valuemin="0" aria-valuemax="100">
          </div>
        </div>
        <p>{{ completedTasks(project) }} de {{ project.tasks.length }} tareas completadas ({{
          progressPercentage(project) }}%) </p>


      </div>



      <div v-if="isAdmin" class="text-center mt-4">
        <button @click="toggleCreateProjectForm" class="btn btn-primary">
          ➕ Crear nuevo proyecto
        </button>
      </div>

    </div>
    <ModalComponent v-if="showModal" @close="closeModal3">
      <CreateProject :project="selectedProject" @project-updated="onProjectUpdated" />
    </ModalComponent>
    <ModalComponent v-if="showCreateProjectForm" @close="toggleCreateProjectForm">
      <CreateProject />
    </ModalComponent>
    <div class="main-container">
      <div class="completed-tasks">
        <h3>Últimas tareas completadas</h3>
        <ul>
          <li v-for="task in completedTaskss" @click="openModal2(task)" :key="task.index">
            <p> {{ task.title }} </p>

          </li>
        </ul>
      </div>

      <ModalComponent2 v-if="selectedTask2" :show="true" @close="closeModal2">

        <h3>{{ selectedTask2.title }}</h3>
        <p><strong>Descripción:</strong> {{ selectedTask2.description }}</p>
        <p><strong>Fecha de Vencimiento:</strong> {{ selectedTask2.due_date }}</p>
        <p><strong>Prioridad:</strong> {{ selectedTask2.priority }}</p>

      </ModalComponent2>

      <div class="grafic">
        <h3>Progreso de Proyectos</h3>
        <div class="chart-container">
          <canvas id="progressChart"></canvas>
        </div>
      </div>
    </div>





  </div>

</template>


<script setup>
import dayjs from 'dayjs';
import { ref, onMounted, computed, watch } from 'vue';
import projectService from '@/services/projectService';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import Chart from 'chart.js/auto';
import authService from '@/services/auth.service';
import CreateProject from '@/components/CreateProject.vue';
import { useAuth } from '@/store/useAuth';

import ModalComponent from './ModalComponent.vue';
import ModalComponent2 from './ModalComponent.vue';
const selectedTask2 = ref(null)
const selectedProject= ref(null)
const  showModal=ref(false)
const openModal2 = (task) => {
  selectedTask2.value = task;
};

// Cerrar el modal
const closeModal2 = () => {
  selectedTask2.value = null;
};
const closeModal3=()=>{
  showModal.value=false
  loadProjects()

}


const openEditModal=(project)=>{
  selectedProject.value = project;
  showModal.value=true
  

}


const projects = ref([]);
const isAdmin = useAuth().isAdmin;
const isSuper = useAuth().isSuper;
const roles = authService.getCurrentUser().roles;
const searchQuery = ref('');
const showCreateProjectForm = ref(false);
const router = useRouter();


const filteredProjects = computed(() => {
  const searchText = searchQuery.value.trim().toLowerCase();
  return projects.value.filter(project => project.name?.toLowerCase().includes(searchText));
});


const completedTaskss = computed(() => {
  return projects.value.flatMap(project => {
    return project.tasks.filter(task => task.status === "Completada");
  }).slice(-5);
});



function completedTasks(project) {
  return project?.tasks?.filter(task => task.status === "Completada").length || 0;
}


function progressPercentage(project) {
  const total = project?.tasks?.length || 0;
  return total > 0 ? Math.round((completedTasks(project) / total) * 100) : 0;
}

const loadProjects = async () => {
  try {
    const response = await projectService.getAllProjects();
    projects.value = response.data;
    if (sessionStorage.getItem("auth") === "true") {
      location.reload();
      sessionStorage.removeItem("auth");
    }
    console.log(projects.value)

  } catch (error) {
    Swal.fire("Error al cargar proyectos.", "", "error");
  }

};

const viewProject = (projectId) => {
  router.push(roles.includes('ROLE_USER') ? `/tasks?projectId=${projectId}` : `/projects/${projectId}`);
};

const formatDate = (date) => {
  return date ? dayjs(date).format('DD/MM/YYYY HH:mm') : "Fecha no disponible";
};

const toggleCreateProjectForm = () => {
  showCreateProjectForm.value = !showCreateProjectForm.value;
  loadProjects()

};

const confirmDeleteProject = (projectId) => {
  Swal.fire({
    title: "¿Estás seguro de que quieres eliminar este proyecto?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  }).then(result => {
    if (result.isConfirmed) {
      deleteProject(projectId);
    }
  });
};

const deleteProject = async (projectId) => {
  try {
    await projectService.deleteProject(projectId);
    Swal.fire("¡Eliminado!", "El proyecto ha sido eliminado correctamente.", "success");
    loadProjects()

  } catch (error) {
    Swal.fire("Error", "Hubo un problema al eliminar el proyecto.", "error");
  }
};

// Declaramos una variable para la instancia del gráfico
let chartInstance = null;

const drawChart = () => {
  if (chartInstance) {
    chartInstance.destroy();  // Destruir el gráfico anterior, si existe
  }

  const ctx = document.getElementById('progressChart').getContext('2d');
  const labels = projects.value.map(project => project.name);
  const completedTasksData = projects.value.map(project => completedTasks(project));
  const totalTasks = projects.value.map(project => project.tasks.length);

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Tareas Completadas',
          data: completedTasksData,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Tareas Pendientes',
          data: totalTasks.map((total, index) => total - completedTasksData[index]),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
};


// Observamos cambios en 'projects' para dibujar el gráfico cuando los datos estén disponibles
watch(projects, () => {
  if (projects.value.length > 0) {
    drawChart();

  }
}, { immediate: true });

onMounted(loadProjects);
</script>


<style scoped>
/* Contenedor de las tareas completadas */
.filter-container {
  margin-bottom: 10px;
}

.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.completed-tasks {
  cursor: pointer;
}

.completed-tasks,
.grafic {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex: 1;
  min-width: 300px;
}



.chart-container {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

canvas {
  display: block;
  max-width: 100%;
  /* Hace el canvas responsivo */
  height: auto;
  /* Mantiene proporciones */
}

.completed-tasks h3 {
  font-size: 24px;
  color: #333;
  margin-bottom: 15px;
}

.completed-tasks ul {
  list-style-type: none;
  padding: 0;
}

.completed-tasks li {

  border: 1px solid #00796b;
  margin-bottom: 8px;
  padding: 10px;
  border-radius: 5px;


}

.completed-tasks li:last-child {
  margin-bottom: 0;
}

/* Contenedor del gráfico */


.grafic h3 {
  font-size: 24px;
  color: #333;
  margin-bottom: 15px;
}

/* Contenedor del canvas del gráfico */
.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.chart-container {
  min-width: max-content;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;

}

.dashboard-container {
  display: flex;
  gap: 20px;
  justify-content: space-between;

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
  background-color: #185cdb;
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
  min-width: 500px;
}
.top-0 {
  top: 0;
}
.end-0 {
  right: 0;
}
@media (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
    align-items: center;
  }

  .projects-list,
  .create-project-container {
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
