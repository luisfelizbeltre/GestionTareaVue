<template>
  <div class="task-container">
   
    <h2>Crear Tarea</h2>
    <form @submit.prevent="createTask">
      <div class="form-group">
        <label for="title">Título:</label>
        <input type="text" v-model="task.title" id="title"  placeholder="Ingrese el título de la tarea" required />
      </div>
    

      <div class="form-group">
        <label for="description">Descripción:</label>
        <textarea v-model="task.description" id="description" placeholder="Ingrese la descripción de la tarea"></textarea>
      </div>

      <div class="form-group">
        <label for="priority">Prioridad:</label>
        <select v-model="task.priority" id="priority">
          <option>Baja</option>
          <option>Media</option>
          <option>Alta</option>
        </select>
      </div>

      <div class="form-group">
        <label for="status">Estado:</label>
        <select v-model="task.status" id="status">
          <option>Pendiente</option>
          <option>En Progreso</option>
          <option>Completada</option>
        </select>
      </div>

      <div class="form-group">
       
        <div class="mb-3">
              <label for="endDate" class="form-label">Fecha de Fin</label>
              <input type="date" v-model="endDate" id="endDate" class="form-control" required />
            </div>

            <div class="mb-3">
              <label for="endTime" class="form-label">Hora de Fin</label>
              <input type="time" v-model="endTime" id="endTime" class="form-control" required />
            </div>
      </div>

     
      <div class="form-group">
          <label for="assignedTo">Asignar a:</label>
          <select v-model="task.assignedTo" id="assignedTo" required>
            <option v-for="user in users" :key="user.id" :value="user.username">{{ user.username }}</option>
          </select>
        </div>

      <div class="form-group">
        <button type="submit">Crear Tarea</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted,defineProps } from 'vue';
import TaskService from '../services/task.service';
import authService from '@/services/auth.service';
import projectService from '@/services/projectService';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
const props = defineProps({
project: {
  type: [String,Number],
  required: true
}
});
const endDateTime = ref('');
const task = ref({
title: '',
description: '',
priority: 'Media',
status: 'Not Started',
dueDate: endDateTime.value,
assignedTo: '',
project: props.project,
tenantId: null,
});
const endDate = ref('');
const endTime = ref('');
const users = ref([]);

const fetchUsers = async () => {
  try {
    const response = await projectService.getAllMembers(props.project);
    users.value = response.data;
  } catch (error) {
    console.error("There was an error fetching the users:", error);
  }
};

const createTask = async () => {

  if (endDate.value && endTime.value) {
 task.value.dueDate= dayjs(`${endDate.value}T${endTime.value}`).format('YYYY-MM-DDTHH:mm:ss');
}
  try {
    // Combinar fecha y hora en un solo valor

    task.value.tenantId = authService.getCurrentUser().tenantId;
    await TaskService.createTask(task.value);
    Swal.fire("Añadida!", "La tarea ha sido añadida correctamente.", "success");

    setTimeout(() => {
    location.reload();
  }, 1500); 
  } catch (error) {
    console.error("There was an error creating the task:", error);
  }
};

onMounted(fetchUsers);
</script>

<style scoped>
.task-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f7f7f7;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="text"],
input[type="date"],
textarea,
select {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #2861a7;
  color: white;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #218838;
}
</style>
