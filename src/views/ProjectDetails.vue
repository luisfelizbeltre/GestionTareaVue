<template>
  <div class="project-details">
    <div v-if="isLoading" class="loading">Cargando detalles del proyecto...</div>
    <div v-else-if="project">
      <div class="project">
        <h1>Nombre: {{ project.name }}</h1>
        <p>Descripcion: {{ project.description }}</p>
        <p>Responsable: {{ project.responsibleUsername }}</p>
      </div>

      <!-- Miembros del proyecto -->
      <div class="members">
        <h2>Miembros ({{ project.members.length }})</h2>
        <ul>
          <li v-for="member in project.members" :key="member.id">{{ member.username }}</li>
        </ul>
        <button @click="toggleMemberForm">➕ Añadir Miembro</button>

        <!-- Formulario para añadir miembros -->
        <div v-if="isMemberFormVisible" class="add-member-form">
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

      <!-- Tareas del proyecto -->
      <div class="tasks">
        <h2>Tareas</h2>
        <ul>
          <li v-for="task in project.tasks" :key="task.id">
            {{ task.title }} - 
            <span :class="taskStatusClass(task.status)">{{ task.status }}</span>
            <button @click="confirmDeleteTask(task.id)">🗑️ Delete</button>
          </li>
        </ul>
        <button @click="toggleTaskForm">➕ Añadir Tarea</button>
      </div>

      <div v-if="isTaskFormVisible">
        <createTasks :project="project.id" />
      </div>
    

      <button @click="goBack">🔙 Volver a Proyectos</button>
    </div>
    <div v-else>
      <p>No se encontró el proyecto. Verifique el ID.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import projectService from '@/services/projectService';
import userService from '@/services/userService';
import createTasks from './createTasks.vue';

const route = useRoute();
const router = useRouter();

// Estados iniciales
const isLoading = ref(true);
const project = ref({ members: [], tasks: [] });
const users = ref([]);
const isTaskFormVisible = ref(false);
const isMemberFormVisible = ref(false);



// Miembro seleccionado para agregar
const newMember = ref('');

// Función para cargar detalles del proyecto
const loadProject = async () => {
  try {
    const response = await projectService.getProjectById(route.params.id);
    project.value = response.data;
    const taskComplet = ref(project.value.tasks.filter(e=>e.status ==="Complete"))
    console.log(project.value.tasks)
    console.log("completeeeeeeeeeeeee "+taskComplet.value)

  } catch (error) {
    console.error("Error al cargar detalles del proyecto:", error);
    alert("Error al cargar detalles del proyecto");
  } finally {
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

// Alternar el formulario de añadir tarea
const toggleTaskForm = () => {
  isTaskFormVisible.value = !isTaskFormVisible.value;
};

// Alternar el formulario de añadir miembro
const toggleMemberForm = () => {
  isMemberFormVisible.value = !isMemberFormVisible.value;
};


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

// Eliminar tarea
const deleteTask = async (taskId) => {
  try {
    await projectService.deleteTask(taskId);
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

.project-details {
  padding: 20px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
}

button {
  background-color: #e74c3c;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #c0392b;
}

.loading {
  margin-top: 20px;
  font-weight: bold;
  color: #555;
}

/* Estilos para el formulario */
.task-form,
.add-member-form {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.tasks, .members {
  margin-top: 20px;
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

.project-details {
  padding: 20px;
}

h2 {
  margin-top: 20px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
}

button {
  margin-left: 10px;
  background-color: #e74c3c;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #c0392b;
}

/* Clases para el estado de las tareas */
.status-completed {
  color: green;
}

.status-pending {
  color: orange;
}

.status-in-progress {
  color: blue;
}

/* Indicador de carga */
.loading {
  margin-top: 20px;
  font-weight: bold;
  color: #555;
}

/* Estilos para el formulario de tareas */
.task-form {
  margin-top: 25%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}
.project{
  height: 10%;
  width: 100%;
  background-color: #4aa0e6;
  border-radius: 10px;
  color: #221616;
}
.members {
  position: absolute; /* Posición absoluta para colocarla a la derecha */
  right: 0; /* Ubicarla en el extremo derecho */
  top: 300px; /* Ajusta esto según el diseño general */
  width: 250px; /* Ancho fijo */
  height: 400px; /* Altura fija */
  padding: 10px;
  background-color: #f0f0f0; /* Color de fondo */
  border-radius: 10px; /* Bordes redondeados */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombra para darle relieve */
  overflow-y: auto; /* Scroll vertical si es necesario */
}

.members h2 {
  margin-top: 0;
  text-align: center; /* Centrar el texto del título */
}

.members ul {
  list-style: none; /* Eliminar viñetas de la lista */
  padding: 0; /* Quitar relleno */
  margin: 0;
}

.members li {
  margin-bottom: 10px;
  padding: 8px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tasks {
  position: absolute; /* Posición absoluta para colocarla en una ubicación específica */
  left: 0; /* Alinear el contenedor de tareas a la izquierda */
  top: 300px; /* Ajusta esto según la ubicación deseada en tu diseño */
  width: 400px; /* Ancho fijo para el área de tareas */
  max-height: 400px; /* Altura máxima con scroll si hay muchas tareas */
  padding: 10px;
  background-color: #f9f9f9; /* Color de fondo */
  border-radius: 10px; /* Bordes redondeados */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombra para darle un efecto de profundidad */
  overflow-y: auto; /* Scroll vertical si es necesario */
}

.tasks h2 {
  text-align: center; /* Centrar el título */
  margin-bottom: 10px;
}

.tasks ul {
  list-style: none; /* Quitar los estilos de viñetas */
  padding: 0;
  margin: 0;
}

.tasks li {
  padding: 10px;
  background-color: #fff;
  margin-bottom: 10px;
  border-radius: 5px; /* Bordes redondeados */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombra ligera */
  display: flex; /* Flexbox para alinear los elementos dentro del li */
  justify-content: space-between; /* Espaciar el título de la tarea y el botón de borrar */
}

.tasks li span {
  font-weight: bold; /* Hacer el estado de la tarea más visible */
}

.tasks button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.tasks button:hover {
  background-color: #c0392b;
}
</style>
