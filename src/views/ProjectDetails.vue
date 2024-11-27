<template>
  <div class="project-details">
    <div v-if="isLoading" class="loading">Cargando detalles del proyecto...</div>
    <div v-else-if="project" class="content">
      <!-- Sección de detalles del proyecto -->
      <div class="card shadow mb-4">
        <div class="card-body">
          <h1 class="card-title">Nombre: {{ project.name }}</h1>
          <p class="card-text"><strong>Descripción:</strong> {{ project.description }}</p>
          <p class="card-text"><strong>Responsable:</strong> {{ project.responsibleUsername }}</p>
          <p class="card-text">
            <strong> Fecha inicio:</strong> {{ formatDate(project.startDate) }} | <strong> Fecha fin:</strong> {{
              formatDate(project.endDate) }}
          </p>
          <!-- Barra de progreso de tareas -->
          <div class="progress mb-3">
            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
              :style="{ width: progressPercentage() + '%' }" :aria-valuenow="progressPercentage()" aria-valuemin="0"
              aria-valuemax="100">
            </div>
          </div>
          <p>{{ completedTasks() }} de {{ totalTasks() }} tareas completadas ({{ progressPercentage() }}%)</p>
        </div>
      </div>
      <div class="padre">
        <!-- Tareas del proyecto -->
        <div class="col-md-6 mb-4 tasks">
          <div class="filter-container">
            <input type="text" v-model="searchQuery" class="form-control" placeholder="Buscar tareas">
          </div>
          <div class="card shadow">
            <div class="card-body">
              <h2 class="card-title text-center">Tareas</h2>
              <ul class="list-group mb-3">
                <li v-for="task in filteredTask" :key="task.id"
                  class="list-group-item d-flex justify-content-between align-items-center">
                  <div class="task-info" >
                    <h5 @click="toggleTaskDetails(task)" :class="taskStatusClass(task.status)"  class="task-title">
                      {{ task.title }}
                      
                      <span class="toggle-icon" v-if="task.isExpanded">🔽</span>
                      <span class="toggle-icon" v-else>▶️</span>
                    </h5>


                    <div v-if="task.isExpanded" class="task-details">
                      <p><strong>Descripción:</strong> {{ task.description }}</p>

                      <p><strong>Fecha de Vencimiento:</strong> {{ formatDate( task.dueDate )}}</p>
                      <p><strong>Prioridad:</strong> <span>{{ task.priority }}</span></p>
                      <p><strong>Estado:</strong> <span :class="taskStatusClass(task.status)">{{ task.status }}</span>
                      </p>
                    </div>
                  </div>
                  <button @click="confirmDeleteTask(task.id)" class="btn btn-danger btn-sm">🗑️</button>
                </li>
              </ul>
              <button @click="toggleTaskForm" class="btn btn-primary w-100">➕ Añadir Tarea</button>
            </div>
          </div>
        </div>


        <div v-if="isTaskFormVisible" class="task-form">
          <button class="x" @click="toggleTaskForm">X</button>
          <createTasks :project="project.id" />
        </div>

        <!-- Miembros del proyecto -->
        <div class="members">
          <h2>Miembros ({{ project.members.length }})</h2>
          <ul>
            <li v-for="member in project.members" :key="member.id">{{ member.username }} <button
                @click="confirmDeleteMember(member.id)">🗑️</button></li>
          </ul>
          <button @click="toggleMemberForm">➕ Añadir Miembro</button>

          <!-- Formulario para añadir miembros -->
          <div v-if="isMemberFormVisible" class="add-member-form">
            <button class="btn-close float-end" @click="toggleMemberForm"></button>
            <h3>Añadir Miembro al Proyecto</h3>

            <form @submit.prevent="addMember">
              <div class="form-group">
                <label for="memberSelect">Seleccionar Usuario:</label>
                <select v-model="newMember" id="memberSelect">
                  <option v-for="user in availableUsers" :key="user.id" :value="user.username">{{ user.username }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <button type="submit">Añadir Miembro</button>
              </div>
            </form>
          </div>
        </div>


      </div>


    </div>
    <div v-else>
      <p>No se encontró el proyecto. Verifique el ID.</p>
    </div>
    <button @click="goBack">🔙 Volver a Proyectos</button>
  </div>

</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import projectService from '@/services/projectService';
import userService from '@/services/userService';
import createTasks from '../components/createTasks.vue';
import taskService from '@/services/task.service';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

const route = useRoute();
const router = useRouter();

// Estados iniciales
const isLoading = ref(true);
const project = ref({ members: [], tasks: [] });
const users = ref([]);
const isTaskFormVisible = ref(false);
const isMemberFormVisible = ref(false);
const searchQuery = ref('');
const newMember = ref(''); // Miembro seleccionado para agregar
const toggleTaskForm = () => {
  isMemberFormVisible.value = false
  isTaskFormVisible.value = !isTaskFormVisible.value;
}
const toggleMemberForm = () => {
  isTaskFormVisible.value = false

  isMemberFormVisible.value = !isMemberFormVisible.value;
};
// Cargar detalles del proyecto
const loadProject = async () => {
  try {
    const response = await projectService.getProjectById(route.params.id);
    project.value = response.data
    
    console.log(project.value);

  } catch (error) {
    console.error("Error al cargar detalles del proyecto:", error);
    Swal.fire("Error", "Error al cargar detalles del proyecto", "error");
  } finally {
    isLoading.value = false;
  }
};
const toggleTaskDetails = (task) => 
  task.isExpanded = !task.isExpanded;


// Cargar lista de usuarios
const fetchUsers = async () => {
  try {
    const response = await userService.getAllUsers();
    users.value = response.data;
  } catch (error) {
    console.error("Error al cargar los usuarios:", error);
    Swal.fire("Error", "Error al cargar los usuarios", "error");
  }
};

// Filtrar tareas según la búsqueda
const filteredTask = computed(() => {
  const searchText = searchQuery.value.trim().toLowerCase();

  const statusOrder = {
    'Pendiente': 1,
    'En progreso': 2,
    'Completada': 3,
  };

  return project.value.tasks
    .filter(task => task.title ? task.title.toLowerCase().includes(searchText) : false)
    .sort((taskA, taskB) => {
      // Primero ordenar por estado (usando el valor definido en `statusOrder`)
      const statusComparison = (statusOrder[taskA.status] || 0) - (statusOrder[taskB.status] || 0);
      console.log(statusComparison)
      if (statusComparison === 0) {
        return taskA.title.localeCompare(taskB.title);
      }

      return statusComparison;
    });
});


// Usuarios disponibles para añadir al proyecto
const availableUsers = computed(() => {
  return users.value.filter(user => {
    return !project.value.members.some(member => member.id === user.id);
  });
});

// Calcular tareas completadas y porcentaje de progreso
function completedTasks() {
  return project.value.tasks.filter(task => task.status === "Completada").length;
}
function totalTasks() {
  return project.value.tasks.length;
}
function progressPercentage() {
  return totalTasks() > 0 ? Math.round((completedTasks() / totalTasks()) * 100) : 0;
}

// Añadir un miembro al proyecto con SweetAlert
const addMember = async () => {
  if (!newMember.value) {
    Swal.fire("Error", "Seleccione un usuario para añadir", "error");
    return;
  }
  try {
    await projectService.addMemberToProject(project.value.id, newMember.value);
    Swal.fire("Éxito", "Miembro añadido exitosamente", "success");
    newMember.value = '';
    isMemberFormVisible.value = false;
    loadProject();
  } catch (error) {
    console.error('Error al añadir miembro:', error);
    Swal.fire("Error", "No se pudo añadir el miembro al proyecto", "error");
  }
};

// Confirmar eliminación de tarea con SweetAlert
const confirmDeleteTask = (taskId) => {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción eliminará la tarea permanentemente.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      deleteTask(taskId);
    }
  });
};

// Confirmar eliminación de miembro con SweetAlert
const confirmDeleteMember = (memberId) => {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción eliminará al miembro del proyecto.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      deleteMember(memberId);
    }
  });
};

// Eliminar miembro del proyecto
const deleteMember = async (memberId) => {
  try {
    await projectService.deleteMember(project.value.id, memberId);
    Swal.fire("Éxito", "Miembro eliminado correctamente", "success");
    loadProject();
  } catch (error) {
    Swal.fire("Error", "No se pudo eliminar el miembro", "error");
  }
};

// Eliminar tarea del proyecto
const deleteTask = async (taskId) => {
  try {
    await taskService.deleteTask(taskId);
    Swal.fire("Éxito", "Tarea eliminada correctamente", "success");
    loadProject();
  } catch (error) {
    console.error("Error al eliminar la tarea:", error);
    Swal.fire("Error", "No se pudo eliminar la tarea", "error");
  }
};

// Regresar a la lista de proyectos
const goBack = () => {
  router.push('/dashboard');
};

// Asignar clases de estado para las tareas
const taskStatusClass = (status) => ({
  'status-completed': status === 'Completada',
  'status-pending': status === 'Pendiente',
  'status-progress': status === 'En Progreso',
});

const formatDate = (date) => {



  return date ? dayjs(date).format('DD/MM/YYYY HH:mm') : "Fecha no disponible";
};

// Cargar proyecto y lista de usuarios al montar el componente
onMounted(() => {
  loadProject();
  fetchUsers();
});
</script>


<style scoped>
.filter-container {
  margin-bottom: 10px;
}

/* Estilos principales */
.padre {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  padding: 20px;
}

.project,
.members,
.tasks {
  flex: 1;
  /* Cada sección tomará un espacio proporcional igual */
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.x {
  float: right;
  position: sticky;
  top: 0;
  font-size: medium;
}
.task-info {
  display: flex;
  flex-direction: column; /* Para mantener la dirección vertical */
  width: 100%;
}

.task-title {
  background-color: #f8f9fa;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  width: 100%; /* Asegura que ocupe todo el ancho disponible */
  margin: 10px 0; /* Márgenes verticales */
  box-sizing: border-box;
  display: flex;
  justify-content: space-between; /* Espacio entre el texto y el icono */
  align-items: center; /* Alinea verticalmente los elementos */
}


.task-title:hover {
  background-color: #e9ecef;
  transform: scale(1.02);
}

.toggle-icon {
  font-size: 18px;
  color: #6c757d;

  /* Color del ícono */
}

.task-title:hover .toggle-icon {
  color: #495057;
  /* Cambio de color del ícono al pasar el cursor */
}

.project {

  color: #221616;
  padding-top: 0;

}

.members,
.tasks {
  background-color: #fff;
  flex-direction: column;
  /* Asegura que el contenido interno esté en columnas */

}


/* Ajustar los contenedores de miembros y tareas para que se alineen en una fila */
ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
  padding: 8px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button {
  background-color: #3c6fe7;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

}

button:hover {
  background-color: #2b7ac0;
}

.loading {
  margin-top: 20px;
  font-weight: bold;
  color: #555;
}

.task-form,
.add-member-form {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.status-completed {
  color: green;
}

.status-pending {
  color: red;
}

.status-progress {
  color: blue;
}


.task-form,
.tasks ul,
.members ul {
  max-height: 500px;
  /* Limitar la altura de las listas */
  overflow-y: auto;
  /* Hacer scroll si hay muchos elementos */
}

.tasks li,
.members li {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.task-form {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  min-width: 20%;
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

/* Media Queries para responsive design */
@media (max-width: 768px) {
  .padre {
    flex-direction: column;
    /* Cambia las columnas a una sola columna */
    gap: 10px;
    /* Reduce el espacio entre los elementos */
  }


  .tasks ul,
  .members ul {
    max-height: 250px;
    /* Limitar la altura de las listas */
    overflow-y: auto;
    /* Hacer scroll si hay muchos elementos */
  }

  .tasks,
  .members,
  .task-form {
    width: 100%;
  }

  .project,
  .members,
  .tasks {
    padding: 15px;
  }

  h1,
  h2 {
    font-size: 1.5rem;
    /* Ajusta el tamaño de los títulos */
  }

  button {
    font-size: 0.9rem;
    /* Ajusta el tamaño de los botones */
    padding: 7px 12px;
  }
}

@media (max-width: 480px) {

  .tasks ul,
  .members ul {
    max-height: 250px;
    /* Limitar la altura de las listas */
    overflow-y: auto;
    /* Hacer scroll si hay muchos elementos */
  }

  .padre {
    padding: 10px;
    /* Reduce el padding general */
  }

  h1,
  h2 {
    font-size: 1.2rem;
    /* Ajusta aún más el tamaño de los títulos */
  }

  button {
    font-size: 0.8rem;
    /* Ajusta el tamaño de los botones */
    padding: 5px 10px;
  }

  .tasks ul,
  .members ul {
    max-height: 200px;
    /* Limitar aún más la altura de las listas en pantallas pequeñas */
  }

  .project,
  .members,
  .tasks {
    padding: 10px;
    /* Reduce el padding interno */
  }
}
</style>