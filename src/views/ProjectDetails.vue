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
  
            <!-- Barra de progreso de tareas -->
            <div class="progress mb-3">
              <div
                class="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                :style="{ width: progressPercentage() + '%' }"
                :aria-valuenow="progressPercentage()"
                aria-valuemin="0"
                aria-valuemax="100">
              </div>
            </div>
            <p>{{ completedTasks() }} de {{ totalTasks() }} tareas completadas ({{ progressPercentage() }}%)</p>
          </div>
        </div>

      <div class="padre">
        <!-- Tareas del proyecto -->
        <div class="col-md-6 mb-4 tasks" >
            <div class="filter-container">
              <input type="text"  v-model="searchQuery" class="form-control" placeholder="Buscar tareas" >
            </div>
            <div class="card shadow " >
              <div class="card-body " >
                <h2 class="card-title text-center">Tareas</h2>
                <ul class="list-group mb-3">
                  <li v-for="task in filteredTask" :key="task.id" class="list-group-item d-flex justify-content-between align-items-center">
                    <span>{{ task.title }} - <span :class="taskStatusClass(task.status)">{{ task.status }}</span></span>
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
            <li v-for="member in project.members" :key="member.id">{{ member.username }} <button @click="confirmDeleteMember(member.id)" >🗑️</button></li>
          </ul>
          <button @click="toggleMemberForm">➕ Añadir Miembro</button>

          <!-- Formulario para añadir miembros -->
          <div v-if="isMemberFormVisible" class="add-member-form">
            <button class="btn-close float-end" @click="toggleMemberForm"></button>
            <h3>Añadir Miembro al Proyecto</h3>
            
            <form @submit.prevent="addMember">
              <div class="form-group">
                <label for="memberSelect">Seleccionar Usuario:</label>
                <select v-model="newMember" id="memberSelect" required>
                  <option v-for="user in users" :key="user.id" :value="user.username">{{ user.username }}</option>
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
import { ref, onMounted,computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import projectService from '@/services/projectService';
import userService from '@/services/userService';
import createTasks from '../components/createTasks.vue';
import taskService from '@/services/task.service';
import DashBoard from './DashBoard.vue';
const toggleTaskForm = () => {
    isMemberFormVisible.value =false
    isTaskFormVisible.value = !isTaskFormVisible.value;
  }
  const toggleMemberForm = () => {
    isTaskFormVisible.value = false
  
    isMemberFormVisible.value = !isMemberFormVisible.value;
  };

const route = useRoute();
const router = useRouter();

// Estados iniciales
const isLoading = ref(true);
const project = ref({ members: [], tasks: [] });
const users = ref([]);
const isTaskFormVisible = ref(false);
const isMemberFormVisible = ref(false);
const searchQuery = ref('');



// Miembro seleccionado para agregar
const newMember = ref('');

// Función para cargar detalles del proyecto
const loadProject = async () => {
  try {
    const response = await projectService.getProjectById(route.params.id);
    project.value = response.data;
    const taskComplet = ref(project.value.tasks.filter(e => e.status === "Completed"))
    console.log(project.value)
    console.log("completeeeeeeeeeeeee " + taskComplet.value)
    console.log("ks" + progressPercentage())
  } catch (error) {
    console.error("Error al cargar detalles del proyecto:", error);
    alert("Error al cargar detalles del proyecto");
  } finally {DashBoard
    isLoading.value = false;
  }
};

// Función para cargar la lista de usuarios
const fetchUsers = async () => {
  try { 
    const response = await userService.getAllUsers();
    users.value = response.data;
  } catch (error) {
    console.error("Error al cargar los usuarios:", error);
    alert("Error al cargar los usuarios");
  }
};

const filteredTask = computed(()=>{
    const searchText = searchQuery.value.trim().toLowerCase();
  console.log(searchText);
  
    return project.value.tasks.filter(task =>{
      const taskTitle = task.title ? task.title.toLowerCase():'';
      return taskTitle.includes(searchText)
    })
  
  })
  


function completedTasks() {
  return project.value.tasks.filter(taska => taska.status === "Completed").length
}

function totalTasks() {
  return project.value.tasks.length
}
function progressPercentage() {
  return totalTasks() > 0 ? Math.round((completedTasks() / totalTasks()) * 100) : 0
}

// Añadir un miembro al proyecto
const addMember = async () => {
  try {
    await projectService.addMemberToProject(project.value.id, newMember.value);
    alert('Miembro añadido exitosamente!');
    newMember.value = '';
    isMemberFormVisible.value = false;
    loadProject();
  } catch (error) {
    console.error('Error al añadir miembro:', error);
    alert('Error al añadir el miembro al proyecto');
  }
};

// Confirmar eliminación de tarea
const confirmDeleteTask = (taskId) => {
  if (confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
    deleteTask(taskId);
  }
};

const confirmDeleteMember=(memberId)=>{
  if (confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
    deleteMember(memberId);
  }

}

const deleteMember = async (memberId) =>{
  try {
    await projectService.deleteMember(project.value.id,memberId)
    loadProject();
  } catch (error) {
    alert("Error al eliminar el miembro")
  }
}
// Eliminar tarea
const deleteTask = async (taskId) => {
  try {
    await taskService.deleteTask(taskId);
    loadProject();
  } catch (error) {
    console.error("Error al eliminar la tarea:", error);
    alert("Error al eliminar la tarea");
  }
};

// Función para regresar a la lista de proyectos
const goBack = () => {
  router.push('/dashboard');
};

// Asignar clases de estado para las tareas
const taskStatusClass = (status) => {
  return {
    'status-completed': status === 'Completed',
    'status-pending': status === 'Pendiente',
    'status-nostarted': status === 'Not Started',
  };
};

// Cargar el proyecto y la lista de usuarios al montar el componente
onMounted(() => {
  loadProject();
  fetchUsers();
});
</script>

<style scoped>
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

.status-nostarted {
  color: red;
}

.status-in-progress {
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
  background-color:#185cdb;
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
</style> y aqui