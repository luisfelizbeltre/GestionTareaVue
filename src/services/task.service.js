import api from './api';

class TaskService {


getTasksByUsername(username) {
 
  return api.get(`´/tasks/users/${username}`);

}

createTask(task) {
  return api.post('/tasks/add', task);
}

// Obtener todas las tareas
getAllTasks() {
  return api.get('/tasks');
}

// Obtener una tarea específica por ID
getTaskById(taskId) {
  return api.get(`/tasks/${taskId}`);
}

// Actualizar una tarea
updateTask(task) {
  return api.put(`/tasks/${task.id}`, task);
}

// Eliminar una tarea
deleteTask(taskId) {
  return api.delete(`/tasks/delete/${taskId}`);
}
}




export default new TaskService();
