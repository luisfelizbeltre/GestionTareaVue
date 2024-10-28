import axios from 'axios';
import apiClient from './api';

axios.defaults.withCredentials=true;
class TaskService {


getTasksByUsername(username) {
 
  return apiClient.get(`´/tasks/users/${username}`);

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
  return apiClient.delete(`/tasks/delete/${taskId}`);
}
}




export default new TaskService();
