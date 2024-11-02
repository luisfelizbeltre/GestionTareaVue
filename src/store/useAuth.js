import { ref, computed, watch } from 'vue';
import AuthService from '../services/auth.service';

const user = ref(AuthService.getCurrentUser()); // Obtener usuario al cargar

const logout = () => {
  AuthService.logout();
  user.value = null;
};

watch(
  () => AuthService.getCurrentUser(),
  (newUser) => {
    user.value = newUser;
  },
  { immediate: true }
);

// Define isAdmin como una propiedad computada reactiva
const isAdmin = computed(() => {
  
  return user.value && user.value.roles && (user.value.roles.includes("ROLE_ADMIN") );
});
const isManager = computed(()=>{
  return user.value && user.value.roles && (user.value.roles.includes("ROLE_MODERATOR"));
})
export function useAuth() {
  return {
    user,
    logout,
    isAdmin,
    isManager,
  };
}
