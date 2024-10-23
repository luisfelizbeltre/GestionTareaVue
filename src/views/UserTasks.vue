<template>


  <div v-if="user" class="user-info">
    <p><strong>Username:</strong> {{ user.username }}</p>
    <p><strong>Email:</strong> {{ user.email }}</p>
    <p><strong>Roles:</strong> {{ user.roles.join(', ') }}</p>

    <p> <strong>Tenant:</strong> {{ user.tenantName }}, {{ user.tenantId }}</p>
   
  </div>

    <div class="tasks-container">
      <h1>Your Tasks</h1>
      <div v-if="tasks.length">
        <div v-for="task in tasks" :key="task.id" class="task">
          <h2>{{ task.title }}</h2>
          <p>{{ task.description }}</p>
          <p><strong>Due Date:</strong> {{ new Date(task.dueDate).toLocaleDateString() }}</p>
          <p><strong>Status:</strong> {{ task.status }}</p>
          <p><strong>Priority:</strong> {{ task.priority }}</p>
        </div>
      </div>
      <div v-else>
        <p>No tasks found.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import TaskService from '../services/task.service';
  import AuthService from '../services/auth.service';
  
  const tasks = ref([]);
  
const user = ref(null);
user.value = AuthService.getCurrentUser();

const user2 = AuthService.getCurrentUser();
  console.log(user2)
   console.log(user2.tenantId)
  const username = user.value ? user.value.username : null;
  
  const fetchTasks = () => {
    if (username) {
      TaskService.getTasksByUsername(username)
        .then(data => {
          tasks.value = data;
        })
        .catch(error => {
          console.error(error);
        });
    }
  };
  
  onMounted(() => {
    fetchTasks();
   
      
  }
  

);

  
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
</style>
  