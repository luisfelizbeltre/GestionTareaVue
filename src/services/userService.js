// src/services/UserService.js
import apiClient from './api';
class UserService {

  // Obtener todos los usuarios
  getAllUsers() {
    return apiClient.get('/users/all');
  }

  // Obtener un usuario específico por ID
  getUserById(userId) {
    return apiClient.get(`/users/${userId}`);
  }

  // Crear un nuevo usuario
  createUser(user) {
    return apiClient.post('/users/create', user);
  }

  // Actualizar un usuario
  updateUser(user) {
    return apiClient.put(`/users/${user.id}`, user);
  }

  // Eliminar un usuario
  deleteUser(userId) {
    return apiClient.delete(`/users/${userId}`);
  }
}

export default new UserService();
