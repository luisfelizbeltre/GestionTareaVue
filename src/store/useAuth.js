import { ref, watch } from 'vue';
import AuthService from '../services/auth.service';

const user = ref(AuthService.getCurrentUser()); // Obtiene el usuario actual al cargar

const logout = () => {
  AuthService.logout(); // Llama al servicio de logout
  user.value = null; // Limpia el usuario del estado
};

// Observa los cambios en el usuario actual
watch(
  () => AuthService.getCurrentUser(),
  (newUser) => {
    user.value = newUser; // Actualiza el usuario reactivo
  },
  { immediate: true } // Ejecuta inmediatamente
);

// Agrega la funcionalidad para verificar si el usuario es administrador
const isAdmin = () => {
  return user.value && user.value.role === 'admin' || user.value.roles.includes("ROLE_MANAGER"); // Verifica si el usuario es admin
};

export function useAuth() {
  return {
    user,
    logout,
    isAdmin, // Exporta la función isAdmin
  };
}
