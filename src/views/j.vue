<template>
    <div class="container my-5">
      <div v-if="isLoading" class="text-center my-3">
        <div class="spinner-border" role="status">
          <span class="sr-only">Cargando...</span>
        </div>
        <p>Cargando detalles del proyecto...</p>
      </div>
  
      <div v-else-if="project" class="content">
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
  
        <div class="row">
          <!-- Tareas del proyecto -->
          <div class="col-md-6 mb-4">
            <div class="filter-container">
              <input type="text"  v-model="searchQuery" class="form-control" placeholder="Buscar tareas" >
            </div>
            <div class="card shadow">
              <div class="card-body">
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
            <div v-if="isTaskFormVisible" class="card mt-3 shadow">
              <div class="card-body">
                <button class="btn-close float-end" @click="toggleTaskForm"></button>
                <createTasks :project="project.id" />
              </div>
            </div>
          </div>
  
          <!-- Miembros del proyecto -->
          <div class="col-md-6 mb-4">
            <div class="card shadow">
              <div class="card-body">
                <h2 class="card-title text-center">Miembros ({{ project.members.length }})</h2>
                <ul class="list-group mb-3">
                  <li v-for="member in project.members" :key="member.id" class="list-group-item">{{ member.username }}</li>
                </ul>
                <button @click="toggleMemberForm" class="btn btn-success w-100">➕ Añadir Miembro</button>
              </div>
            </div>
            <div v-if="isMemberFormVisible" class="card mt-3 shadow">
              <div class="card-body">
                <button class="btn-close float-end" @click="toggleMemberForm"></button>
  
                <h3>Añadir Miembro al Proyecto</h3>
                
                <form @submit.prevent="addMember">
                  <div class="mb-3">
                    <label for="memberSelect" class="form-label">Seleccionar Usuario:</label>
                    <select v-model="newMember" id="memberSelect" class="form-select" required>
                      <option v-for="user in users" :key="user.id" :value="user.username">{{ user.username }}</option>
                    </select>
                  </div>
                  <button type="submit" class="btn btn-primary">Añadir Miembro</button>
                </form>
              </div>
            </div>
          </div>
        </div>
          <!-- Miembros del proyecto ---------^^-->
      </div>
  
      <div v-else class="text-center">
        <p>No se encontró el proyecto. Verifique el ID.</p>
      </div>
      <button @click="goBack" class="btn btn-secondary mt-3">🔙 Volver a Proyectos</button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted,computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import projectService from '@/services/projectService';
  import userService from '@/services/userService';
  import createTasks from '../components/createTasks.vue';
  import taskService from '@/services/task.service';
  
  const route = useRoute();
  const router = useRouter();
  const isLoading = ref(true);
  const project = ref({ members: [], tasks: [] });
  const users = ref([]);
  const isTaskFormVisible = ref(false);
  const isMemberFormVisible = ref(false);
  const newMember = ref('');
  const searchQuery = ref('');
  const toggleTaskForm = () => {
    isMemberFormVisible.value =false
    isTaskFormVisible.value = !isTaskFormVisible.value;
  }
  const toggleMemberForm = () => {
    isTaskFormVisible.value = false
  
    isMemberFormVisible.value = !isMemberFormVisible.value;
  };
  
  const completedTasks = () => project.value.tasks.filter(taska => taska.status === "Completed").length;
  const totalTasks = () => project.value.tasks.length;
  const progressPercentage = () => totalTasks() > 0 ? Math.round((completedTasks() / totalTasks()) * 100) : 0;
  
  const loadProject = async () => {
    try {
      const response = await projectService.getProjectById(route.params.id);
      project.value = response.data;
    } catch (error) {
      console.error("Error al cargar detalles del proyecto:", error);
      alert("Error al cargar detalles del proyecto");
    } finally {
      isLoading.value = false;
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
  
  
  const fetchUsers = async () => {
    try { 
      const response = await userService.getAllUsers();
      users.value = response.data;
    } catch (error) {
      console.error("Error al cargar los usuarios:", error);
      alert("Error al cargar los usuarios");
    }
  };
  
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
  
  const confirmDeleteTask = (taskId) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta tarea?")) deleteTask(taskId);
  };
  
  const deleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      loadProject();
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
      alert("Error al eliminar la tarea");
    }
  };
  
  const goBack = () => router.push('/dashboard');
  const taskStatusClass = (status) => {
    return {
      'text-success': status === 'Completed',
      'text-danger': status === 'Not Started',
      'text-primary': status === 'In Progress',
    };
  };
  
  onMounted(() => {
    loadProject();
    fetchUsers();
  });
  </script>
  
  <style scoped>
  .progress {
    height: 20px;
  }
  .list-group-item {
    display: flex;
    justify-content: space-between;
  }
  </style>
  