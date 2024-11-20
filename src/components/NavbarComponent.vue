<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet"> <!-- Nueva línea -->


  <nav :class="['navbar', 'navbar-expand-lg', 'navbar-dark', isSuper ? 'bg-danger' : 'bg-primary', 'px-3']">
    <a class="navbar-brand dashboard-title d-flex align-items-center" href="#">
    <!-- Añadir logo -->
    <img src="/pngwing.com.png" alt="Logo" class="logo mr-2">
    {{ dynamicTitle }}
  </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
      aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <router-link to="/" class="nav-link" aria-label="Ir a la página principal">
            <i class="fas fa-home"></i> Home
          </router-link>
        </li>
        <li class="nav-item" v-if="user">
          <router-link to="/dashboard" class="nav-link" aria-label="Ver mis proyectos">
            <i class="fas fa-cogs"></i> DASHBOARD
          </router-link>
        </li>
        <li class="nav-item" v-if="user && !isSuper">
          <router-link to="/tasks" class="nav-link" aria-label="Ver mis tareas">
            <i class="fas fa-tasks"></i> Tareas
          </router-link>
        </li>
        <li class="nav-item" v-if="user">
          <router-link to="/profile" class="nav-link" aria-label="Ir a mi perfil">
            <i class="fas fa-user-circle"></i> Perfil
          </router-link>
        </li>
        <li class="nav-item" v-if="(user && isAdmin) || (user && isSuper)  ">
          <router-link to="/manage-users" class="nav-link" aria-label="Gestionar usuarios">
            <i class="fas fa-users-cog"></i> Gestionar Usuarios
          </router-link>
        </li>
        <li class="nav-item" v-if=" (user && isSuper)  ">
          <router-link to="/manage-company" class="nav-link" aria-label="Gestionar empresas">
            <i class="bi bi-building-fill-gear"></i> Gestionar Empresas

          </router-link>
        </li>
        <li class="nav-item" v-if="!user">
          <router-link to="/login" class="nav-link" aria-label="Iniciar sesión">
            <i class="fas fa-sign-in-alt"></i> Login
          </router-link>
        </li>
        <li class="nav-item" v-if="!user">
          <router-link to="/registeradm" class="nav-link" aria-label="Registrar un nuevo administrador">
            <i class="fas fa-user-plus"></i> Register
          </router-link>
        </li>
        <li class="nav-item" v-if="user">
          <button @click="handleLogout" class="btn btn-link nav-link" aria-label="Cerrar sesión">
            <i class="fas fa-sign-out-alt"></i> Logout
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '../store/useAuth'; // Ruta al composable
const router = useRouter();
const route = useRoute();

const { user, logout, isAdmin, isManager,isSuper } = useAuth();

const handleLogout = () => {
  logout();
  router.push('/login');
};


// Computed property para actualizar el título basado en la ruta actual
const dynamicTitle = computed(() => {
  switch (route.path) {
    case '/dashboard':
      if (isAdmin.value) {
        return "DASHBOARD ADMINISTRADOR"
      } else if (isManager.value) {
        return "DASHBOARD MODERADOR" 
      }else if (isSuper.value) {
        return "DASHBOARD SUPER USUARIO"
      } else {
        return "DASHBOARD USUARIOS"

      }


    case '/tasks':
      return 'GESTION DE TAREAS';
      case '/manage-company':
      return 'GESTION DE EMPRESAS';
    case '/profile':
      return 'Mi Perfil';
    case '/manage-users':
      return 'GESTION DE USUARIOS';
    case '/':
      return 'HOME'
    case '/projects':
      return 'DESTALLEs DEL PROYECTO'
    default:
       // Manejar subrutas que comienzan con '/projects/'
       if (route.path.startsWith('/projects/')) {
        return 'DETALLE DEL PROYECTO';
        }
      return '';
  }
});
</script>

<style scoped>
.dashboard-title {
  font-size: 1.5rem;
  /* Ajuste de tamaño de fuente para el título */
  font-weight: bold;
  color: #ffffff;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  /* Espacio entre ícono y texto */
  font-size: 1rem;
  color: #ffffff;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}

.btn-link {
  color: #ffffff;
}

.btn-link:hover {
  text-decoration: none;
  color: #e8ebee;
}
nav {
  position: sticky;
  top: 0;
  z-index: 50;

}
.logo {

  width: 50px; /* Ajusta el tamaño según sea necesario */
  height: 100%;
  margin-right: 10px; /* Espacio entre el logo y el texto */
  border-radius: 10px; /* Opcional: redondea los bordes */


}
</style>