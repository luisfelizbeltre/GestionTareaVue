
<template>
  <div v-if="user" class="user-info">
    <p><strong>Username:</strong> {{ user.username }}</p>
    <p><strong>Email:</strong> {{ user.email }}</p>
    <p><strong>Roles:</strong> {{ user.roles.join(', ') }}</p>
    <p><strong>Tenant:</strong> {{ user.tenantName }}, {{ user.tenantId }}</p>
  </div>


  <div class="task-board">
    <h2>Gestión de Tareas con Drag & Drop</h2>
    <div class="task-columns">
      <div class="task-column">
        <h3>Por Hacer</h3>
        <draggable v-model="taskss.todo" group="tasks" @end="onDrop" item-key="id">
          <template #item="{ element }">
            <div class="task-item">
              {{ element.title }}
            </div>
          </template>
        </draggable>
      </div>

      <div class="task-column">
        <h3>En Progreso</h3>
        <draggable v-model="taskss.inProgress" group="tasks" @end="onDrop" item-key="id">
          <template #item="{ element }">
            <div class="task-item">
              {{ element.title }}
            </div>
          </template>
        </draggable>
      </div>

      <div class="task-column">
        <h3>Completadas</h3>
        <draggable v-model="taskss.done" group="tasks" @end="onDrop" item-key="id">
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
import { useRoute } from 'vue-router';
//import router from '@/router';

const tasks = ref([]);
const user = ref(AuthService.getCurrentUser());
const username = user.value ? user.value.username : null;

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

        // Filtrar las tareas por estado y asignarlas a las columnas
        taskss.value.todo = tasks.value.filter((task) => task.status === 'Not Started');
        taskss.value.inProgress = tasks.value.filter((task) => task.status === 'In Progress');
        taskss.value.done = tasks.value.filter((task) => task.status === 'Completed');
      })
      .catch((error) => {
        console.error(error);
      });
  }
};

onMounted(() => {
  fetchTasks();
});

// Función para manejar el evento de arrastre
const onDrop = (evt) => {
  const { item, to } = evt;
   console.log( useRoute().params.projectId)

  // Aquí puedes actualizar el estado de la tarea en el backend
  console.log(`Moved task: ${item.name} to ${to.id}`);
};
</script>
  
<style scoped>
  .tasks-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
   }
  
  .task {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
  }
  .user-info {
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
  }
  .task-board {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task-columns {
  display: flex;
  gap: 20px;
}

.task-column {
  flex: 1;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.task-item {
  padding: 10px;
  margin-bottom: 8px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: move;
}
</style>
  