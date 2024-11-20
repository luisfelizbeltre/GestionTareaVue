
<template>
 
 <!-- Botones para seleccionar proyecto -->
 <div class="project-buttons"  id="Not Started">
  <label for="">Proyectos:</label>
      <button 
        v-for="project in projects"
        :key="project.id"
        @click="selectProject(project.id)"
        class="btn btn-outline-primary m-2"
      >
        {{ project.name }}
      </button>
    </div>

  <div class="task-board">
    <h2>Gestión de Tareas con Drag & Drop</h2>
    <div class="task-columns">
      <div class="task-column" data-status="Not Started">
        <h3>Por Hacer</h3>
        <draggable v-model="taskss.todo" group="tasks" @end="onDrop" item-key="id">
          <template #item="{ element }">
            <div class="task-item">
              {{ element.title }}
            </div>
          </template>
        </draggable>
      </div>

      <div class="task-column" data-status="In Progress">
        <h3>En Progreso</h3>
        <draggable v-model="taskss.inProgress" group="tasks" @end="onDrop" item-key="id">
          <template #item="{ element }">
            <div class="task-item">
              {{ element.title }}
            </div>
          </template>
        </draggable>
      </div>

      <div class="task-column" data-status="Completed">
        <h3>Completadas</h3>
        <draggable :list="taskss.done" group="tasks" @end="onDrop" item-key="id">
          <template #item="{ element }">
            <div class="task-item">
              {{ element.title }}
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TaskService from '../services/task.service';
import AuthService from '../services/auth.service';
import draggable from 'vuedraggable';
import projectService from '@/services/projectService';
//import { useRoute } from 'vue-router';
import Swal from 'sweetalert2';
//const route = useRoute(); // Obtiene información de la URL

const tasks = ref([]);
const user = ref(AuthService.getCurrentUser());
const username = user.value ? user.value.username : null;
const projects = ref();
//const projectIdg = ref(route.query.projectId); // Captura el projectId del query string

// Configuración inicial para el drag & drop de tareas
const taskss = ref({
  todo: [],
  inProgress: [],
  done: [],
});
// Función para obtener tareas y organizarlas en las columnas según su estado
const fetchTasks = () => {
  if (username) {
    TaskService.getAllTasks()
      .then((response) => {
        tasks.value = response.data;
        console.log(tasks.value)
        filterTasksByProject();
      
      })
      .catch((error) => {
        Swal.fire('Error al cargar tareas:', error);
      });
  }
};

// Función para obtener proyectos desde el backend
const fetchProjects = () => {
  projectService.getAllProjects()
    .then((response) => {
      projects.value = response.data;
          filterTasksByProject();
    })
    .catch((error) => {
      Swal.fire('Error al cargar proyectos:', error);
    });
};

const removeProjectIdFromURL = () => {
  const url = new URL(window.location);
  url.searchParams.delete('projectId'); // Elimina el parámetro 'projectId'

  // Actualiza la URL sin recargar la página
  window.history.replaceState({}, '', url);
};

const selectedProjectId = ref(null); // Proyecto seleccionado

// Filtrar tareas por el proyecto seleccionado
const filterTasksByProject = () => {
  if (selectedProjectId.value) {
    const filteredTasks = tasks.value.filter(
      (task) => task.project === selectedProjectId.value
    );

    taskss.value.todo = filteredTasks.filter((task) => task.status === 'Not Started');
    taskss.value.inProgress = filteredTasks.filter((task) => task.status === 'In Progress');
    taskss.value.done = filteredTasks.filter((task) => task.status === 'Completed');
  }
};

// Manejar la selección de un proyecto
const selectProject = (projectId) => {
  selectedProjectId.value = projectId;

  // Guardar en localStorage
  localStorage.setItem('selectedProjectId', projectId);

  filterTasksByProject();
  removeProjectIdFromURL();
};

onMounted(() => {
  // Intentar recuperar el proyecto seleccionado de localStorage
  const savedProjectId = localStorage.getItem('selectedProjectId');
  selectedProjectId.value = savedProjectId ? Number(savedProjectId) : null;

  fetchProjects();
  fetchTasks();
  filterTasksByProject();
});


const onDrop = (evt) => {
  // Obtén la tarea movida
  const movedTask = evt.item.__draggable_context.element;

  // Obtén el nuevo estado de la tarea desde el atributo 'data-status' del destino
  const newStatus = evt.to.closest('.task-column').dataset.status;

  // Imprime el nombre de la tarea y el nuevo estado
  const taskTitle = movedTask.title;
  console.log(`La tarea "${taskTitle}" ahora está en estado: ${newStatus}`);

  // Crea el objeto de tarea con el nuevo estado
  const updatedTask = {
    ...movedTask, // Copiar los datos de la tarea existente
    status: newStatus, // Actualizar el estado
  };

  // Llamar a la función para actualizar la tarea en el servidor
  TaskService.updateTask(updatedTask)
    .then(response => {
      console.log('Tarea actualizada:', response.data);
    })
    .catch(error => {
      console.error('Error al actualizar la tarea:', error);
    });
};


</script>
<style scoped>
/* Contenedor principal de tareas */
.tasks-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

/* Información del usuario */
.user-info {
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
  text-align: center;
  font-weight: bold;
}

/* Tablero de tareas */
.task-board {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.task-columns {
  display: flex;
  gap: 20px;
}

/* Estilo de columnas */
.task-column {
  flex: 1;
  padding: 15px;
  background-color: #e6f7ff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s;
}

.task-column:hover {
  transform: translateY(-5px);
}

.task-column h3 {
  font-size: 1.2rem;
  text-align: center;
  color: #007acc;
  border-bottom: 2px solid #007acc;
  padding-bottom: 5px;
}

/* Tareas individuales */
.task-item {
  padding: 12px;
  margin-bottom: 10px;
  background-color: #ffffff;
  border: 1px solid #007acc;
  border-radius: 8px;
  cursor: move;
  transition: box-shadow 0.3s ease, transform 0.2s ease;
}

.task-item:hover {
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* Botones del proyecto */
.project-buttons {
  text-align: center;
  margin-bottom: 20px;
}

.project-buttons label {
  font-weight: bold;
  margin-right: 10px;
  color: #333;
}
/* Estilo de columnas con colores específicos */
.task-column[data-status="Not Started"] {
  background-color: #ffebee; /* Rosa suave */
  border: 2px solid #f44336;
}

.task-column[data-status="In Progress"] {
  background-color: #e3f2fd; /* Azul claro */
  border: 2px solid #2196f3;
}

.task-column[data-status="Completed"] {
  background-color: #e8f5e9; /* Verde pálido */
  border: 2px solid #4caf50;
}

.project-buttons .btn {
  padding: 10px 15px;
  font-size: 1rem;
  color: #fff;
  background-color: #007acc;
  border: none;
  border-radius: 8px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.project-buttons .btn:hover {
  background-color: #005f99;
  transform: scale(1.05);
}

.project-buttons .btn:active {
  transform: scale(0.95);
}

/* Scroll en caso de muchas tareas */
.task-column {
  max-height: 700px;
  overflow-y: auto;
}

.task-column::-webkit-scrollbar {
  width: 8px;
}

.task-column::-webkit-scrollbar-thumb {
  background: #007acc;
  border-radius: 4px;
}

.task-column::-webkit-scrollbar-track {
  background: #e6f7ff;
}
</style>
