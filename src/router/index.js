import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import LoginComponent from '../components/LoginComponent.vue';
import ProfileComponent from '../components/ProfileComponent.vue';
import CreateProject from '../components/CreateProject.vue';
import UserTasks from '../views/UserTasks.vue'; 
import RegisterTenant from '../components/RegisterTenant';
import createTasks from '../components/createTasks.vue';

import ProjectList from '@/views/ProjectList.vue';
import ProjectDetails from '@/views/ProjectDetails.vue';
import dashboard from '@/views/DashBoard.vue';
import UserManagement from '@/views/UserManagement.vue';
import unauthorized from '@/components/UnaUthorized.vue';
const routes = [
// Rutas que no requieren autenticación
{ path: '/', component: Home },  // Página de inicio
{ path: '/login', component: LoginComponent },  // Página de inicio de sesión
{ path: '/registeradm', component: RegisterTenant },  // Página de registro de administradores
{ path: '/unauthorized', component: unauthorized},  // Gestión de usuarios

// Rutas que requieren autenticación
{ path: '/profile', component: ProfileComponent, meta: { requiresAuth: true } },  // Perfil del usuario
{ path: '/tasks', component: UserTasks, meta: { requiresAuth: true } },  // Lista de tareas del usuario

// Rutas relacionadas con proyectos (requieren autenticación)
{ path: '/create-project', component: CreateProject, meta: { requiresAuth: true,requireRole:['ROLE_ADMIN'] } },  // Crear proyecto
{ path: '/proyects', component: ProjectList, meta: { requiresAuth: true } },  // Lista de proyectos
{ path: '/projects/:id', component: ProjectDetails, meta: { requiresAuth: true,requireRole:['ROLE_ADMIN','ROLE_MODERATOR'] } },  // Detalles del proyecto

// Otras rutas que requieren autenticación
{ path: '/createTask', component: createTasks, meta: { requiresAuth: true,requireRole:['ROLE_ADMIN','ROLE_MODERATOR'] }},  // Crear tarea
{ path: '/dashboard', component: dashboard, meta: { requiresAuth: true } },  // Dashboard
{ path: '/manage-users', component: UserManagement, meta: { requiresAuth: true,requireRole:['ROLE_ADMIN'] } },  // Gestión de usuarios

  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  if (to.matched.some(record => record.meta.requiresAuth) && !user) {
    next('/login');
  } else if(to.matched.some(record=>record.meta.requireRole))   {
    
    const requireRole=to.meta.requireRole;
    if (user && user.roles && requireRole.some(role=> user.roles.includes(role))) {
      next()
    } else {
     next("/unauthorized") 
    }
   
  } else{
    next();

  }
});

export default router;
