<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow-lg">
          <div class="card-header bg-primary text-white text-center">
            <h2>Crear Proyecto</h2>
          </div>
          <div class="card-body">
            <form @submit.prevent="createProject" class="needs-validation">
              <div class="mb-3">
                <label for="name" class="form-label">Nombre del Proyecto</label>
                <input type="text" v-model="name" id="name" placeholder="Nombre del Proyecto" class="form-control" required />
              </div>

              <div class="mb-3">
                <label for="description" class="form-label">Descripción</label>
                <input type="text" v-model="description" id="description" placeholder="Descripción" class="form-control" required />
              </div>

              <div class="mb-3">
                <label for="responsibleUsername" class="form-label">Responsable</label>
                <input type="text" v-model="responsibleUsername" id="responsibleUsername" placeholder="Nombre del Responsable" class="form-control" required />
              </div>

              <div class="mb-3">
                <label for="endDate" class="form-label">Fecha de Fin</label>
                <input type="date" v-model="endDate" id="endDate" class="form-control" required />
              </div>

              <div class="mb-3">
                <label for="endTime" class="form-label">Hora de Fin</label>
                <input type="time" v-model="endTime" id="endTime" class="form-control" required />
              </div>

              <div class="text-center">
                <button type="submit" class="btn btn-success w-100">Crear Proyecto</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import projectService from '../services/projectService';
import dayjs from 'dayjs';

const name = ref('');
const description = ref('');
const responsibleUsername = ref('');
const endDate = ref('');
const endTime = ref('');
const endDateTime = ref('');

const createProject = async () => {
  // Combinar fecha y hora en un solo valor
  if (endDate.value && endTime.value) {
    endDateTime.value = dayjs(`${endDate.value}T${endTime.value}`).format('YYYY-MM-DDTHH:mm:ss');
    alert(`Fecha y Hora combinadas: ${endDateTime.value}`);
  } else {
    alert("Por favor selecciona una fecha y una hora.");
    return;
  }

  const project = {
    name: name.value,
    description: description.value,
    responsibleUsername: responsibleUsername.value,
    endDate: endDateTime.value,
  };

  try {
    await projectService.createProject(project);
    alert('Proyecto creado exitosamente');
    location.reload(); // Recargar para actualizar la lista de proyectos
  } catch (error) {
    console.error('Error creando el proyecto:', error);
    alert('Error al crear el proyecto');
  }
};
</script>

<style scoped>
.card {
  border-radius: 8px;
}
.card-header {
  font-size: 24px;
  font-weight: 500;
}
</style>
