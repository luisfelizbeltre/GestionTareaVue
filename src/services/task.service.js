import axios from 'axios';
import AuthService from './auth.service';
import apiClient from './api';

const API_URL = 'http://localhost:8080/api/tasks';
axios.defaults.withCredentials=true;
class TaskService {
  getTasksByUsername() {
  const user = AuthService.getCurrentUser();
  
  console.log("--------------- " + user.accessToken);
  
  if (user && user.accessToken) {
    return axios.get(API_URL, {
      headers: {
        'Authorization': 'Bearer ' + user.accessToken,
        'Content-Type': 'application/json'
      },
      params:{
        'tenantId': user.tenantId
      }
    }).then(response => response.data)
    .catch(error => {
      console.error("-----------There was an error fetching tasks:", error);
      return Promise.reject(error);
    });
  } else {
    return Promise.reject("No token found");
  }
}

createTask(task) {
  return apiClient.post('/tasks/add', task);
}

// Obtener todas las tareas
getAllTasks() {
  return apiClient.get('/tasks');
}

// Obtener una tarea específica por ID
getTaskById(taskId) {
  return apiClient.get(`/tasks/${taskId}`);
}

// Actualizar una tarea
updateTask(task) {
  return apiClient.put(`/tasks/${task.id}`, task);
}

// Eliminar una tarea
deleteTask(taskId) {
  return apiClient.delete(`/tasks/${taskId}`);
}
}




export default new TaskService();
