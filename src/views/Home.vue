<template>
  <div class="home-container">
    <h1 class="home-title">Bienvenido a la Aplicación</h1>
    <p class="home-description">
      Nuestra aplicación te ayuda a gestionar tus tareas de manera eficiente, mejorar tu productividad y organizar tus proyectos de forma sencilla. 
    </p>
    
    <!-- Sección de funcionalidades -->
    <div class="features-container">
      <div class="feature">
        <h2>Organiza tus Tareas</h2>
        <p>Clasifica, asigna prioridades y lleva un control eficiente de tus pendientes.</p>
      </div>
      <div class="feature">
        <h2>Colabora con tu Equipo</h2>
        <p>Comparte tareas y proyectos con tu equipo de trabajo fácilmente.</p>
      </div>
      <div class="feature">
        <h2>Notificaciones en Tiempo Real</h2>
        <p>Recibe alertas para que nunca olvides una tarea importante.</p>
      </div>
    </div>

    <!-- Sección de botones -->
    <div class="link-container">
      <router-link to="/login" class="link-button">Iniciar Sesión</router-link>
      <router-link to="/registeradm" class="link-button">Registrarse</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeC',
};
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  height: 100vh; /* Full viewport height */
  background-color: #f0f4f8;
  padding: 20px;
  text-align: center;
}

.home-title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
}

.home-description {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 30px;
  max-width: 600px;
}

.features-container {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
  width: 100%;
  max-width: 800px;
}

.feature {
  text-align: center;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  max-width: 250px;
}

.feature h2 {
  font-size: 1.5rem;
  color: #007bff;
  margin-bottom: 10px;
}

.feature p {
  font-size: 1rem;
  color: #555;
}

.link-container {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.link-button {
  text-decoration: none;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  padding: 10px 20px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.link-button:hover {
  background-color: #0056b3;
}

.link-button:active {
  background-color: #004494;
}
</style>
